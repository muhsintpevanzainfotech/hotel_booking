const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'roomModel' },
    roomModel: { type: String, required: true, enum: ['Room', 'ComboOffer'], default: 'Room' },
    guestName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    specialRequests: { type: String },
    totalPrice: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    bookingReference: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
