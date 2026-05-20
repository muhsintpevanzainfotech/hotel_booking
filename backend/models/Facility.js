const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // Main image (thumbnail/icon)
    coverImage: { type: String }, // Larger background/banner image
    icon: { type: String } // Icon class or name
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);
