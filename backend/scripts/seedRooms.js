require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');

const rooms = [
    {
        name: 'Royal Lakeside Suite',
        description: 'Experience unparalleled luxury in our signature suite overlooking the serene alpine lake. Features a private terrace and marble bathroom.',
        price: 850,
        type: 'Rooms',
        capacity: 2,
        amenities: ['Private Terrace', 'Mini Bar', 'King Bed', 'Lake View'],
        images: [{ url: 'uploads/rooms/royal-suite.png' }],
    },
    {
        name: 'Executive Garden View',
        description: 'A perfect blend of comfort and elegance with floor-to-ceiling windows facing our manicured estate gardens.',
        price: 450,
        type: 'Rooms',
        capacity: 2,
        amenities: ['Garden View', 'Work Desk', 'WiFi', 'Rain Shower'],
        images: [{ url: 'uploads/rooms/executive-garden.png' }],
    },
    {
        name: 'Family Heritage Wing',
        description: 'Spacious accommodations for the whole family, featuring two connected bedrooms and a dedicated lounge area.',
        price: 650,
        type: 'Combo Offer',
        capacity: 4,
        amenities: ['Lounge Area', 'Kitchenette', 'Two Bathrooms', 'TV'],
        images: [{ url: 'uploads/rooms/family-wing.png' }],
        isAvailable: true
    }
];

const seedRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Room.deleteMany({}); // Clear existing rooms
        await Room.insertMany(rooms);
        
        console.log('Rooms seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding rooms:', err);
        process.exit(1);
    }
};

seedRooms();
