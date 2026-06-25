const mongoose = require('mongoose');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { deleteFile } = require('../utils/fileHelper');

exports.createRoom = async (req, res) => {
    try {
        const { name, description, price, amenities, quantity, type, capacity, imageCategories, hasDiscount, discountType, discountValue } = req.body;
        
        const parsedHasDiscount = hasDiscount === true || hasDiscount === 'true';
        const parsedDiscountType = discountType || 'Percentage';
        const parsedDiscountValue = parsedHasDiscount ? (parseFloat(discountValue) || 0) : 0;
        const parsedPrice = parseFloat(price) || 0;

        if (parsedHasDiscount) {
            if (parsedDiscountValue < 0) {
                return res.status(400).json({ message: 'Discount cannot be negative.' });
            }
            if (parsedDiscountType === 'Percentage') {
                if (parsedDiscountValue > 100) {
                    return res.status(400).json({ message: 'Percentage must be between 0 and 100.' });
                }
            } else if (parsedDiscountType === 'Flat Amount') {
                if (parsedDiscountValue > parsedPrice) {
                    return res.status(400).json({ message: 'Flat Discount cannot be greater than the Room Price.' });
                }
            }
        }

        let finalPrice = parsedPrice;
        if (parsedHasDiscount) {
            if (parsedDiscountType === 'Percentage') {
                finalPrice = Math.max(0, parsedPrice - (parsedPrice * parsedDiscountValue) / 100);
            } else if (parsedDiscountType === 'Flat Amount') {
                finalPrice = Math.max(0, parsedPrice - parsedDiscountValue);
            }
        }

        const categories = imageCategories ? (typeof imageCategories === 'string' ? JSON.parse(imageCategories) : imageCategories) : [];
        const images = req.files ? req.files.map((file, index) => {
            return {
                url: file.path.replace(/\\/g, '/'),
                category: categories[index] || 'General'
            };
        }) : [];
        
        const newRoom = new Room({
            name, 
            description, 
            price: parsedPrice, 
            type,
            capacity,
            amenities: typeof amenities === 'string' ? JSON.parse(amenities) : amenities, 
            facilities: req.body.facilities ? (typeof req.body.facilities === 'string' ? JSON.parse(req.body.facilities) : req.body.facilities) : [],
            quantity, 
            images,
            hasDiscount: parsedHasDiscount,
            discountType: parsedDiscountType,
            discountValue: parsedDiscountValue,
            finalPrice
        });
        
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('facilities');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const currentPrice = req.body.price !== undefined ? parseFloat(req.body.price) : room.price;
        const currentHasDiscount = req.body.hasDiscount !== undefined ? (req.body.hasDiscount === true || req.body.hasDiscount === 'true') : room.hasDiscount;
        const currentDiscountType = req.body.discountType !== undefined ? req.body.discountType : room.discountType;
        const currentDiscountValue = req.body.discountValue !== undefined ? parseFloat(req.body.discountValue) : room.discountValue;

        if (currentHasDiscount) {
            if (currentDiscountValue < 0) {
                return res.status(400).json({ message: 'Discount cannot be negative.' });
            }
            if (currentDiscountType === 'Percentage') {
                if (currentDiscountValue > 100) {
                    return res.status(400).json({ message: 'Percentage must be between 0 and 100.' });
                }
            } else if (currentDiscountType === 'Flat Amount') {
                if (currentDiscountValue > currentPrice) {
                    return res.status(400).json({ message: 'Flat Discount cannot be greater than the Room Price.' });
                }
            }
        }

        let finalPrice = currentPrice;
        if (currentHasDiscount) {
            if (currentDiscountType === 'Percentage') {
                finalPrice = Math.max(0, currentPrice - (currentPrice * currentDiscountValue) / 100);
            } else if (currentDiscountType === 'Flat Amount') {
                finalPrice = Math.max(0, currentPrice - currentDiscountValue);
            }
        }

        req.body.hasDiscount = currentHasDiscount;
        req.body.discountType = currentDiscountType;
        req.body.discountValue = currentHasDiscount ? currentDiscountValue : 0;
        req.body.finalPrice = finalPrice;

        const { amenities, facilities, imageCategories } = req.body;
        if (amenities) {
            req.body.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        }
        if (facilities) {
            req.body.facilities = typeof facilities === 'string' ? JSON.parse(facilities) : facilities;
        }

        // Parse existing images sent from frontend
        let existingImages = [];
        if (req.body.existingImages) {
            existingImages = typeof req.body.existingImages === 'string' 
                ? JSON.parse(req.body.existingImages) 
                : req.body.existingImages;
        }

        // Normalize existingImages to always be objects with url
        existingImages = existingImages.map(img => {
            if (typeof img === 'string' && img) return { url: img, category: 'General' };
            if (img && typeof img === 'object' && img.url) return { url: img.url, category: img.category || 'General' };
            return null;
        }).filter(Boolean);

        // Identify which images were removed, so we can delete them from Cloudinary
        if (room.images && room.images.length > 0) {
            const keptUrls = new Set(existingImages.map(img => img.url).filter(Boolean));
            const removedImages = room.images.filter(img => {
                const url = (img && typeof img === 'object') ? img.url : img;
                return url && !keptUrls.has(url);
            });
            
            await Promise.all(removedImages.map(async (img) => {
                const url = (img && typeof img === 'object') ? img.url : img;
                if (url && typeof url === 'string') {
                    deleteFile(url);
                }
            }));
        }

        // Upload any new images
        let newImages = [];
        if (req.files && req.files.length > 0) {
            const categories = imageCategories ? (typeof imageCategories === 'string' ? JSON.parse(imageCategories) : imageCategories) : [];
            newImages = req.files.map((file, index) => {
                return {
                    url: file.path.replace(/\\/g, '/'),
                    category: categories[index] || 'General'
                };
            });
        }

        // Set the final images list
        req.body.images = [...existingImages, ...newImages];

        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('facilities');
        res.json(updatedRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (room && room.images) {
            await Promise.all(room.images.map(async (img) => {
                const url = (img && typeof img === 'object') ? img.url : img;
                if (url && typeof url === 'string') {
                    deleteFile(url);
                }
            }));
        }
        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: 'Room deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkAvailability = async (req, res) => {
    try {
        const { roomId, checkIn, checkOut } = req.body;
        
        const bookings = await Booking.find({
            room: roomId,
            status: 'Approved',
            $or: [
                { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
            ]
        });

        const room = await Room.findById(roomId);
        const isAvailable = bookings.length < room.quantity;

        res.json({ isAvailable });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        let room;
        if (mongoose.Types.ObjectId.isValid(id)) {
            room = await Room.findById(id).populate('facilities');
        } else {
            const slugify = (text) => text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-');
            
            const rooms = await Room.find().populate('facilities');
            room = rooms.find(r => slugify(r.name) === id.toLowerCase());
        }

        if (!room) {
            const ComboOffer = require('../models/ComboOffer');
            if (mongoose.Types.ObjectId.isValid(id)) {
                room = await ComboOffer.findById(id);
            } else {
                const slugify = (text) => text
                    .toString()
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-');
                const combos = await ComboOffer.find();
                room = combos.find(c => slugify(c.title) === id.toLowerCase());
            }
        }

        if (!room) return res.status(404).json({ message: 'Sanctuary not found' });
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
