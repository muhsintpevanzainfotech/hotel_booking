const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    phone: { type: String },
    whatsapp: { type: String },
    email: { type: String },
    address: { type: String },
    socialLinks: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    },
    mapLink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
