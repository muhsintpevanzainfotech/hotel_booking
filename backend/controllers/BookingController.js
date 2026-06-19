const Booking = require('../models/Booking');
const Room = require('../models/Room');
const ComboOffer = require('../models/ComboOffer');
const Notification = require('../models/Notification');

exports.createBooking = async (req, res) => {
    try {
        const { room: roomId, checkIn, checkOut, guestName } = req.body;
        
        // Final availability check before booking
        const conflict = await Booking.find({
            room: roomId,
            status: 'Approved',
            $or: [
                { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
            ]
        });

        let room = await Room.findById(roomId);
        let roomModel = 'Room';
        let limit = 0;
        let roomName = '';

        if (!room) {
            room = await ComboOffer.findById(roomId);
            if (!room) {
                return res.status(404).json({ message: 'Room or Package not found' });
            }
            roomModel = 'ComboOffer';
            limit = 100; // default large limit for combo packages
            roomName = room.title;
        } else {
            limit = room.quantity;
            roomName = room.name;
        }

        if (conflict.length >= limit) {
            return res.status(400).json({ message: roomModel === 'ComboOffer' ? 'Package not available for selected dates' : 'Room not available for selected dates' });
        }

        // Generate Booking Reference
        const bookingReference = 'HB-' + Math.random().toString(36).substr(2, 8).toUpperCase();

        const newBooking = new Booking({
            ...req.body,
            roomModel,
            bookingReference
        });
        await newBooking.save();

        // Create Notification
        await new Notification({
            title: roomModel === 'ComboOffer' ? 'New Package Reservation' : 'New Room Reservation',
            message: `${guestName} reserved ${roomModel === 'ComboOffer' ? 'package' : 'a'} ${roomName}.`,
            type: 'booking',
            referenceId: newBooking._id
        }).save();

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        let bookings = await Booking.find().populate('room').sort({ createdAt: -1 });
        
        // Mock data for demo if empty
        if (bookings.length === 0) {
            const rooms = await Room.find().limit(3);
            if (rooms.length > 0) {
                bookings = [
                    {
                        _id: 'mock1',
                        guestName: 'Julian Casablancas',
                        bookingReference: 'HB-MOCK-001',
                        room: rooms[0],
                        checkIn: new Date(),
                        checkOut: new Date(Date.now() + 86400000 * 2),
                        status: 'Approved',
                        totalPrice: rooms[0].price * 2
                    },
                    {
                        _id: 'mock2',
                        guestName: 'Diana Prince',
                        bookingReference: 'HB-MOCK-002',
                        room: rooms[1] || rooms[0],
                        checkIn: new Date(Date.now() - 86400000),
                        checkOut: new Date(Date.now() + 86400000),
                        status: 'Pending',
                        totalPrice: (rooms[1] || rooms[0]).price * 2
                    }
                ];
            }
        }
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const update = {};
        if (status) update.status = status;
        if (paymentStatus) update.paymentStatus = paymentStatus;
        
        const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true }).populate('room');
        
        if (status) {
            const { sendBookingStatusEmail } = require('../utils/emailService');
            sendBookingStatusEmail(booking).catch(err => console.error('Error sending booking status email:', err));
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookingByReference = async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingReference: req.params.ref.toUpperCase() }).populate('room');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRoomBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ 
            room: req.params.roomId,
            status: 'Approved'
        }).select('checkIn checkOut');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

