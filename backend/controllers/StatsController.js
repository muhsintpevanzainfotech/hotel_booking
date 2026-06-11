const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Enquiry = require('../models/Enquiry');
const Blog = require('../models/Blog');
const Banner = require('../models/Banner');
const Offer = require('../models/Offer');
const Facility = require('../models/Facility');
const Testimonial = require('../models/Testimonial');
const Gallery = require('../models/Gallery');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Category = require('../models/Category');
const ComboOffer = require('../models/ComboOffer');

exports.getGlobalStats = async (req, res) => {
    try {
        const [
            roomCount, 
            bookingCount, 
            enquiryCount, 
            contactCount,
            blogCount,
            bannerCount,
            offerCount,
            facilityCount,
            testimonialCount,
            galleryCount,
            userCount,
            notificationCount,
            unreadNotificationCount,
            categoryCount,
            comboOfferCount
        ] = await Promise.all([
            Room.countDocuments(),
            Booking.countDocuments(),
            Enquiry.countDocuments({ type: 'enquiry' }),
            Enquiry.countDocuments({ type: 'contact' }),
            Blog.countDocuments(),
            Banner.countDocuments(),
            Offer.countDocuments(),
            Facility.countDocuments(),
            Testimonial.countDocuments(),
            Gallery.countDocuments(),
            User.countDocuments(),
            Notification.countDocuments(),
            Notification.countDocuments({ isRead: false }),
            Category.countDocuments(),
            ComboOffer.countDocuments()
        ]);

        const valuationResult = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    total: { $sum: { $ifNull: ["$totalPrice", 0] } }
                }
            }
        ]);

        let approvedValue = 0, approvedCount = 0;
        let pendingValue = 0, pendingCount = 0;
        let rejectedValue = 0, rejectedCount = 0;
        let cancelledValue = 0, cancelledCount = 0;

        valuationResult.forEach(item => {
            if (item._id === 'Approved') {
                approvedValue = item.total;
                approvedCount = item.count;
            } else if (item._id === 'Pending') {
                pendingValue = item.total;
                pendingCount = item.count;
            } else if (item._id === 'Rejected') {
                rejectedValue = item.total;
                rejectedCount = item.count;
            } else if (item._id === 'Cancelled') {
                cancelledValue = item.total;
                cancelledCount = item.count;
            }
        });

        // If no booking data exists yet, provide some fallback default values for UI demo
        if (bookingCount === 0) {
            approvedValue = 245000;
            pendingValue = 89000;
            approvedCount = 0;
            pendingCount = 0;
        }

        const totalEstimatedValue = approvedValue + pendingValue;

        res.json({
            rooms: roomCount,
            bookings: bookingCount,
            enquiries: enquiryCount,
            contacts: contactCount,
            blogs: blogCount,
            banners: bannerCount,
            offers: offerCount,
            facilities: facilityCount,
            testimonials: testimonialCount,
            gallery: galleryCount,
            users: userCount,
            notifications: notificationCount,
            categories: categoryCount,
            comboOffers: comboOfferCount,
            unreadNotifications: unreadNotificationCount,
            revenue: approvedValue, // Backward compatibility with "revenue" field
            approvedRevenue: approvedValue,
            approvedCount,
            pendingRevenue: pendingValue,
            pendingCount,
            rejectedRevenue: rejectedValue,
            rejectedCount,
            cancelledRevenue: cancelledValue,
            cancelledCount,
            totalEstimatedValue
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDashboardAnalytics = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        let analytics = await Booking.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // If no real data, provide cinematic mock data for the demo
        if (analytics.length === 0) {
            const mockData = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                mockData.push({
                    name: monthNames[date.getMonth()],
                    bookings: Math.floor(Math.random() * 50) + 20,
                    revenue: Math.floor(Math.random() * 50000) + 30000
                });
            }
            return res.json(mockData);
        }

        const formattedData = analytics.map(item => ({
            name: monthNames[item._id.month - 1],
            bookings: item.bookings,
            revenue: item.revenue
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

