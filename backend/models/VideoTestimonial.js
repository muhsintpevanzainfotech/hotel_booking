const mongoose = require('mongoose');

const videoTestimonialSchema = new mongoose.Schema({
    video: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('VideoTestimonial', videoTestimonialSchema);
