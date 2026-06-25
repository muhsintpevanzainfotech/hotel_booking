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
    quantity: { type: Number, default: 1 },
    hasDiscount: { type: Boolean, default: false },
    discountType: { type: String, enum: ['Percentage', 'Flat Amount'], default: 'Percentage' },
    discountValue: { type: Number, default: 0 },
    finalPrice: { type: Number }
}, { timestamps: true });

roomSchema.pre('validate', function(next) {
    const price = this.price || 0;
    if (this.hasDiscount) {
        const val = this.discountValue || 0;
        if (this.discountType === 'Percentage') {
            this.finalPrice = Math.max(0, price - (price * val) / 100);
        } else if (this.discountType === 'Flat Amount') {
            this.finalPrice = Math.max(0, price - val);
        } else {
            this.finalPrice = price;
        }
    } else {
        this.finalPrice = price;
    }
    next();
});

module.exports = mongoose.model('Room', roomSchema);
