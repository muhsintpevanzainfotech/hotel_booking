const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        try {
            const Facility = require('./models/Facility');
            const results = await Facility.find();
            console.log('--- FACILITIES ---');
            results.forEach(f => {
                console.log(`Title: ${f.title}`);
                console.log(`Image: ${f.image}`);
                console.log(`CoverImage: ${f.coverImage}`);
                console.log(`Icon: ${f.icon}`);
                console.log('------------------');
            });
            process.exit(0);
        } catch (err) {
            console.error('Error during query:', err);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
