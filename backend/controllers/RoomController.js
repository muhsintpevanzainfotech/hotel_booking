const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { deleteFile } = require('../utils/fileHelper');
const { uploadToCloudinary, deleteFromCloudinary, isCloudinaryUrl } = require('../utils/cloudinaryHelper');

exports.createRoom = async (req, res) => {
    try {
        const { name, description, price, amenities, quantity, type, capacity, imageCategories } = req.body;
        
        const categories = imageCategories ? (typeof imageCategories === 'string' ? JSON.parse(imageCategories) : imageCategories) : [];
        const images = req.files ? await Promise.all(req.files.map(async (file, index) => {
            const uploaded = await uploadToCloudinary(file.path, 'hotel_booking/rooms');
            deleteFile(file.path);
            return {
                url: uploaded.url,
                category: categories[index] || 'General'
            };
        })) : [];
        
        const newRoom = new Room({
            name, 
            description, 
            price, 
            type,
            capacity,
            amenities: typeof amenities === 'string' ? JSON.parse(amenities) : amenities, 
            facilities: req.body.facilities ? (typeof req.body.facilities === 'string' ? JSON.parse(req.body.facilities) : req.body.facilities) : [],
            quantity, 
            images
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

        const { amenities, facilities, imageCategories } = req.body;
        if (amenities) {
            req.body.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        }
        if (facilities) {
            req.body.facilities = typeof facilities === 'string' ? JSON.parse(facilities) : facilities;
        }

        // Handle Image Updates
        if (req.files && req.files.length > 0) {
            if (room.images && room.images.length > 0) {
                await Promise.all(room.images.map(async (img) => {
                    if (img.url) {
                        if (isCloudinaryUrl(img.url)) await deleteFromCloudinary(img.url);
                        else deleteFile(img.url);
                    }
                }));
            }
            const categories = imageCategories ? (typeof imageCategories === 'string' ? JSON.parse(imageCategories) : imageCategories) : [];
            req.body.images = await Promise.all(req.files.map(async (file, index) => {
                const uploaded = await uploadToCloudinary(file.path, 'hotel_booking/rooms');
                deleteFile(file.path);
                return {
                    url: uploaded.url,
                    category: categories[index] || 'General'
                };
            }));
        }

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
                if (img.url) {
                    if (isCloudinaryUrl(img.url)) await deleteFromCloudinary(img.url);
                    else deleteFile(img.url);
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
