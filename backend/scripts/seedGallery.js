require('dotenv').config();
const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');

const galleryItems = [
    { image: 'uploads/gallery/pool.png', title: 'Infinity Pool' },
    { image: 'uploads/gallery/lobby.png', title: 'Grand Lobby' },
    { image: 'uploads/gallery/dining.png', title: 'Fine Dining' }
];

const seedGallery = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Gallery.deleteMany({}); // Clear existing gallery
        await Gallery.insertMany(galleryItems);
        
        console.log('Gallery seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding gallery:', err);
        process.exit(1);
    }
};

seedGallery();
