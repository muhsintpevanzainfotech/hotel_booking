const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking';
console.log('Connecting to:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected!');
        try {
            const ComboOffer = require('./models/ComboOffer');
            console.log('Required ComboOffer model successfully');
            
            console.log('Querying combo offers...');
            const results = await ComboOffer.find().sort('-createdAt');
            console.log('Query complete, count:', results.length);
            console.log('Results:', results);
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
