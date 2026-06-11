const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, default: 'Rooms' },
    capacity: { type: Number, default: 2 },
    images: [{ 
        url: { type: String, required: true },
        category: { type: String, default: 'General' }
    }],
    amenities: [{ type: String }],
    facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Facility' }],
    isAvailable: { type: Boolean, default: true },
    quantity: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
