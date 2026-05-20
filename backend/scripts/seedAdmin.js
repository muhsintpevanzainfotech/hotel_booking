require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ role: 'super_admin' });
        if (existingAdmin) {
            console.log('Super Admin already exists');
            process.exit(0);
        }

        const superAdmin = new User({
            username: 'superadmin',
            email: 'muhsintp.develop@gmail.com',
            password: 'Admin@123', // This will be hashed by the model pre-save hook
            role: 'super_admin',
            permissions: ['all']
        });

        await superAdmin.save();
        console.log('Super Admin created successfully');
        // console.log('UserDetails:',superAdmin);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding Super Admin:', err);
        process.exit(1);
    }
};

seedSuperAdmin();
