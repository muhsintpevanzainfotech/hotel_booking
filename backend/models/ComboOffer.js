const mongoose = require('mongoose');

const comboOfferSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    includes: [{ type: String }],
    links: { type: String },
    coverImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ComboOffer', comboOfferSchema);
