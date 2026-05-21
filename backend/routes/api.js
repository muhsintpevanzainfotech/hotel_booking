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
router.delete('/notifications/:id', auth, notificationCtrl.deleteNotification);

// User Management
router.get('/users', auth, checkRole(['super_admin', 'admin']), authCtrl.getAllUsers);
router.post('/users', auth, checkRole(['super_admin', 'admin']), authCtrl.register);
router.put('/users/:id', auth, checkRole(['super_admin', 'admin']), authCtrl.updateUser);
router.delete('/users/:id', auth, checkRole(['super_admin', 'admin']), authCtrl.deleteUser);

// Room & Booking (Public)
router.get('/rooms', roomCtrl.getAllRooms);
router.post('/check-availability', roomCtrl.checkAvailability);
router.post('/book', bookingCtrl.createBooking);
router.get('/bookings/reference/:ref', bookingCtrl.getBookingByReference);
router.get('/rooms/:roomId/bookings', bookingCtrl.getRoomBookings);

// Content (Public)
router.get('/contact', adminCtrl.getContact);
router.get('/blogs', adminCtrl.getBlogs);
router.get('/testimonials', adminCtrl.getTestimonials);
router.get('/gallery', adminCtrl.getGallery);
router.get('/banners', adminCtrl.getBanners);
router.get('/offers', adminCtrl.getOffers);
router.post('/enquiry', adminCtrl.createEnquiry);

// Admin Restricted Routes (Accessible by admin and super_admin)
router.post('/rooms', auth, checkRole(['super_admin', 'admin']), upload.array('images', 30), roomCtrl.createRoom);
router.patch('/rooms/:id', auth, checkRole(['super_admin', 'admin']), upload.array('images', 30), roomCtrl.updateRoom);
router.delete('/rooms/:id', auth, checkRole(['super_admin', 'admin']), roomCtrl.deleteRoom);

router.get('/bookings', auth, checkRole(['super_admin', 'admin']), bookingCtrl.getAllBookings);
router.patch('/bookings/:id', auth, checkRole(['super_admin', 'admin']), bookingCtrl.updateBookingStatus);

router.get('/enquiries', auth, checkRole(['super_admin', 'admin']), adminCtrl.getEnquiries);
router.put('/contact', auth, checkRole(['super_admin']), adminCtrl.updateContact);

router.post('/blogs', auth, checkRole(['super_admin', 'admin']), upload.single('image'), adminCtrl.createBlog);
router.patch('/blogs/:id', auth, checkRole(['super_admin', 'admin']), upload.single('image'), adminCtrl.updateBlog);
router.delete('/blogs/:id', auth, checkRole(['super_admin', 'admin']), adminCtrl.deleteBlog);
router.post('/gallery', auth, checkRole(['super_admin', 'admin']), upload.array('images', 10), adminCtrl.uploadGallery);
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

module.exports = router;
