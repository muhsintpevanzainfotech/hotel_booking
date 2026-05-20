const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['booking', 'enquiry', 'contact', 'system'], default: 'system' },
    isRead: { type: Boolean, default: false },
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // Link to the booking/enquiry/etc
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
