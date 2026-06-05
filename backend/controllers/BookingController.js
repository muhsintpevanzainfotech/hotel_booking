const Booking = require('../models/Booking');
const Room = require('../models/Room');
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

        const room = await Room.findById(roomId);
        if (conflict.length >= room.quantity) {
            return res.status(400).json({ message: 'Room not available for selected dates' });
        }

        // Generate Booking Reference
        const bookingReference = 'HB-' + Math.random().toString(36).substr(2, 8).toUpperCase();

        const newBooking = new Booking({
            ...req.body,
            bookingReference
        });
        await newBooking.save();

        // Create Notification
        await new Notification({
            title: 'New Room Reservation',
            message: `${guestName} reserved a ${room.name}.`,
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
        let bookings = await Booking.find().populate('room');
        
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

