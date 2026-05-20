require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking');
        console.log('Connected to MongoDB');

        const adminUsername = process.env.ADMIN_USER || 'admin';
        const adminPassword = process.env.ADMIN_PASS || 'admin@123';

        let admin = await User.findOne({ username: adminUsername });
        
        if (admin) {
            console.log('Admin user already exists. Updating password...');
            admin.password = adminPassword;
            admin.isVerified = true;
            admin.isActive = true;
            await admin.save();
        } else {
            admin = new User({
                username: adminUsername,
                email: 'admin@lakebreeze.com',
                password: adminPassword,
                role: 'super_admin',
                permissions: ['all'],
                isVerified: true,
                isActive: true
            });
            await admin.save();
            console.log('Admin user created successfully');
        }

        console.log(`Username: ${adminUsername}`);
        console.log(`Password: ${adminPassword}`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding Admin:', err);
        process.exit(1);
    }
};

seedAdmin();
