require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');

const migrate = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const rooms = await Room.find();
        console.log(`Found ${rooms.length} rooms to check.`);

        let updatedCount = 0;
        for (const room of rooms) {
            let changed = false;
            
            if (room.hasDiscount === undefined) {
                room.hasDiscount = false;
                changed = true;
            }
            if (room.discountType === undefined) {
                room.discountType = 'Percentage';
                changed = true;
            }
            if (room.discountValue === undefined) {
                room.discountValue = 0;
                changed = true;
            }
            if (room.finalPrice === undefined || room.finalPrice === null) {
                const price = room.price || 0;
                if (room.hasDiscount) {
                    const val = room.discountValue || 0;
                    if (room.discountType === 'Percentage') {
                        room.finalPrice = Math.max(0, price - (price * val) / 100);
                    } else if (room.discountType === 'Flat Amount') {
                        room.finalPrice = Math.max(0, price - val);
                    } else {
                        room.finalPrice = price;
                    }
                } else {
                    room.finalPrice = price;
                }
                changed = true;
            }

            if (changed) {
                await room.save();
                console.log(`Updated room: ${room.name}`);
                updatedCount++;
            }
        }

        console.log(`Migration completed. Updated ${updatedCount} rooms.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
