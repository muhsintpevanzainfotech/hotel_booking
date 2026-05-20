const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: 'Guest' },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
