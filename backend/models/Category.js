const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String },
    type: { type: String, required: true, default: 'room' }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
