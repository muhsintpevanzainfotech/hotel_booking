const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfdqeafgo',
    api_key: process.env.CLOUDINARY_API_KEY || '825788494675926',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'iKSbR-Km765gCg2PZEOoTQxnktg'
});

module.exports = cloudinary;
