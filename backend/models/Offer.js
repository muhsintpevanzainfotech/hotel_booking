const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    discount: { type: String, required: true },
    description: { type: String },
    code: { type: String },
    status: { type: String, enum: ['Live', 'Paused'], default: 'Live' },
    color: { type: String, default: 'text-primary' }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
