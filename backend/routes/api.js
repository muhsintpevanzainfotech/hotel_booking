const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const upload = require('../config/multer');

const adminCtrl = require('../controllers/AdminController');
const roomCtrl = require('../controllers/RoomController');
const bookingCtrl = require('../controllers/BookingController');
const authCtrl = require('../controllers/AuthController');
const statsCtrl = require('../controllers/StatsController');
const notificationCtrl = require('../controllers/NotificationController');

// Auth Routes
router.post('/login', authCtrl.login);
router.post('/logout', authCtrl.logout);
router.get('/auth-status', authCtrl.checkStatus);
router.post('/verify-otp', authCtrl.verifyOTP);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);
router.put('/profile', auth, authCtrl.updateProfile);
router.get('/stats', auth, statsCtrl.getGlobalStats);
router.get('/analytics', auth, statsCtrl.getDashboardAnalytics);

// Notifications
router.get('/notifications', auth, notificationCtrl.getNotifications);
router.put('/notifications/read', auth, notificationCtrl.markAsRead);
router.delete('/notifications', auth, notificationCtrl.deleteAll);
router.delete('/notifications/:id', auth, notificationCtrl.deleteNotification);

// User Management
router.get('/users', auth, checkRole(['super_admin', 'admin']), authCtrl.getAllUsers);
router.post('/users', auth, checkRole(['super_admin', 'admin']), authCtrl.register);
router.put('/users/:id', auth, checkRole(['super_admin', 'admin']), authCtrl.updateUser);
router.delete('/users/:id', auth, checkRole(['super_admin', 'admin']), authCtrl.deleteUser);

// Room & Booking (Public)
router.get('/rooms', roomCtrl.getAllRooms);
router.get('/rooms/:id', roomCtrl.getRoomById);
router.post('/check-availability', roomCtrl.checkAvailability);
router.post('/book', bookingCtrl.createBooking);
router.get('/bookings/reference/:ref', bookingCtrl.getBookingByReference);
router.get('/rooms/:roomId/bookings', bookingCtrl.getRoomBookings);

// Content (Public)
router.get('/contact', adminCtrl.getContact);
router.get('/blogs', adminCtrl.getBlogs);
router.get('/blogs/:slug', adminCtrl.getBlogBySlug);
router.get('/testimonials', adminCtrl.getTestimonials);
router.get('/gallery', adminCtrl.getGallery);
router.get('/banners', adminCtrl.getBanners);
router.get('/offers', adminCtrl.getOffers);
router.get('/categories', adminCtrl.getCategories);
router.get('/combo-offers', adminCtrl.getComboOffers);
router.post('/enquiry', adminCtrl.createEnquiry);

// Admin Restricted Routes (Accessible by admin and super_admin)
router.post('/rooms', auth, checkRole(['super_admin', 'admin']), upload.array('images', 30), roomCtrl.createRoom);
router.patch('/rooms/:id', auth, checkRole(['super_admin', 'admin']), upload.array('images', 30), roomCtrl.updateRoom);
router.delete('/rooms/:id', auth, checkRole(['super_admin', 'admin']), roomCtrl.deleteRoom);

router.get('/bookings', auth, checkRole(['super_admin', 'admin']), bookingCtrl.getAllBookings);
router.patch('/bookings/:id', auth, checkRole(['super_admin', 'admin']), bookingCtrl.updateBookingStatus);

router.get('/enquiries', auth, checkRole(['super_admin', 'admin']), adminCtrl.getEnquiries);
router.delete('/enquiries/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.deleteEnquiry);
router.put('/contact', auth, checkRole(['super_admin']), adminCtrl.updateContact);

router.post('/blogs', auth, checkRole(['super_admin', 'admin']), upload.single('image'), adminCtrl.createBlog);
router.patch('/blogs/:id', auth, checkRole(['super_admin', 'admin']), upload.single('image'), adminCtrl.updateBlog);
router.delete('/blogs/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.deleteBlog);
const { galleryUpload } = upload;

router.post('/gallery', auth, checkRole(['super_admin', 'admin']), galleryUpload.array('images', 10), adminCtrl.uploadGallery);
router.delete('/gallery/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.deleteGallery);

router.post('/testimonials', auth, checkRole(['super_admin', 'admin']), upload.single('image'), adminCtrl.createTestimonial);
router.patch('/testimonials/:id', auth, checkRole(['super_admin', 'admin']), upload.single('image'), adminCtrl.updateTestimonial);
router.delete('/testimonials/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.deleteTestimonial);

router.get('/facilities', adminCtrl.getFacilities);
router.post('/facilities', auth, checkRole(['super_admin', 'admin']), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), adminCtrl.createFacility);
router.patch('/facilities/:id', auth, checkRole(['super_admin', 'admin']), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), adminCtrl.updateFacility);
router.delete('/facilities/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.deleteFacility);

router.post('/banners', auth, checkRole(['super_admin', 'admin']), upload.single('image'), adminCtrl.createBanner);
router.patch('/banners/:id', auth, checkRole(['super_admin', 'admin']), upload.single('image'), adminCtrl.updateBanner);
router.delete('/banners/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.deleteBanner);

router.post('/offers', auth, checkRole(['super_admin', 'admin']), adminCtrl.createOffer);
router.patch('/offers/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.updateOffer);
router.delete('/offers/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.deleteOffer);

router.post('/categories', auth, checkRole(['super_admin', 'admin']), upload.single('image'), adminCtrl.createCategory);
router.patch('/categories/:id', auth, checkRole(['super_admin', 'admin']), upload.single('image'), adminCtrl.updateCategory);
router.delete('/categories/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.deleteCategory);

router.post('/combo-offers', auth, checkRole(['super_admin', 'admin']), upload.single('coverImage'), adminCtrl.createComboOffer);
router.patch('/combo-offers/:id', auth, checkRole(['super_admin', 'admin']), upload.single('coverImage'), adminCtrl.updateComboOffer);
router.delete('/combo-offers/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.deleteComboOffer);

// Sitemap trigger route (Public for verification/generation)
router.get('/generate-sitemap', async (req, res) => {
    try {
        const Room = require('../models/Room');
        const Blog = require('../models/Blog');
        const fs = require('fs');
        const path = require('path');

        const domain = 'https://lakebreezeresorts.com/';
        const outputPath = path.join(__dirname, '../../website/public/sitemap.xml');

        const staticPages = [
            { path: '', priority: '1.0', changefreq: 'daily' },
            { path: 'rooms', priority: '0.8', changefreq: 'daily' },
            { path: 'gallery', priority: '0.6', changefreq: 'monthly' },
            { path: 'about', priority: '0.6', changefreq: 'monthly' },
            { path: 'contact', priority: '0.6', changefreq: 'monthly' },
            { path: 'facilities', priority: '0.6', changefreq: 'monthly' },
            { path: 'blog', priority: '0.7', changefreq: 'daily' },
            { path: 'offers', priority: '0.7', changefreq: 'weekly' },
            { path: 'privacy-policy', priority: '0.3', changefreq: 'monthly' },
            { path: 'terms-conditions', priority: '0.3', changefreq: 'monthly' }
        ];

        const slugify = (text) => text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');

        const rooms = await Room.find({}, 'name updatedAt');
        const blogs = await Blog.find({}, 'slug updatedAt');

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        staticPages.forEach(p => {
            const url = `${domain}${p.path}`;
            const date = new Date().toISOString().split('T')[0];
            xml += '  <url>\n';
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${date}</lastmod>\n`;
            xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
            xml += `    <priority>${p.priority}</priority>\n`;
            xml += '  </url>\n';
        });

        rooms.forEach(r => {
            const url = `${domain}rooms/${slugify(r.name)}`;
            const date = (r.updatedAt || new Date()).toISOString().split('T')[0];
            xml += '  <url>\n';
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${date}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.7</priority>\n';
            xml += '  </url>\n';
        });

        blogs.forEach(b => {
            const url = `${domain}blog/${b.slug}`;
            const date = (b.updatedAt || new Date()).toISOString().split('T')[0];
            xml += '  <url>\n';
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${date}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.6</priority>\n';
            xml += '  </url>\n';
        });

        xml += '</urlset>\n';

        fs.writeFileSync(outputPath, xml, 'utf8');
        res.json({ success: true, message: 'Sitemap generated successfully!', rooms: rooms.length, blogs: blogs.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
