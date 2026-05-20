const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['contact', 'enquiry'], default: 'contact' },
    status: { type: String, enum: ['New', 'Read', 'Replied'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
