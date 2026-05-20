const path = require('path');
const cloudinary = require('../config/cloudinary');

const isCloudinaryUrl = (imageUrl) => {
    return /^https?:\/\/res\.cloudinary\.com\//i.test(imageUrl);
};

const getPublicIdFromUrl = (imageUrl) => {
    if (!imageUrl) return null;

    try {
        const parsed = new URL(imageUrl);
        const uploadPath = parsed.pathname.split('/image/upload/')[1] || '';
        const publicPath = uploadPath.replace(/^v\d+\//, '');
        const dotIndex = publicPath.lastIndexOf('.');
        return dotIndex === -1 ? publicPath : publicPath.substring(0, dotIndex);
    } catch (error) {
        return null;
    }
};

const uploadToCloudinary = async (filePath, folder = 'hotel_booking') => {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, '..', filePath);
    const result = await cloudinary.uploader.upload(absolutePath, {
        folder,
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
        overwrite: false
    });

    return {
        url: result.secure_url,
        public_id: result.public_id
    };
};

const deleteFromCloudinary = async (imageUrl) => {
    if (!imageUrl || !isCloudinaryUrl(imageUrl)) return;

    const publicId = getPublicIdFromUrl(imageUrl);
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch (error) {
        console.error('Cloudinary deletion failed:', error);
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary, isCloudinaryUrl };
