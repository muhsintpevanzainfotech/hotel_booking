const Enquiry = require('../models/Enquiry');
const Contact = require('../models/Contact');
const Blog = require('../models/Blog');
const Facility = require('../models/Facility');
const Testimonial = require('../models/Testimonial');
const Gallery = require('../models/Gallery');
const Notification = require('../models/Notification');
const Banner = require('../models/Banner');
const Offer = require('../models/Offer');
const { deleteFile } = require('../utils/fileHelper');
const { uploadToCloudinary, deleteFromCloudinary, isCloudinaryUrl } = require('../utils/cloudinaryHelper');

// Enquiry Logic
exports.createEnquiry = async (req, res) => {
    try {
        const enquiry = new Enquiry(req.body);
        await enquiry.save();

        // Create Notification
        await new Notification({
            title: enquiry.type === 'enquiry' ? 'New Guest Enquiry' : 'New Contact Message',
            message: `From ${enquiry.name}: ${enquiry.subject}`,
            type: enquiry.type === 'enquiry' ? 'enquiry' : 'contact',
            referenceId: enquiry._id
        }).save();

        res.status(201).json(enquiry);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getEnquiries = async (req, res) => {
    try { 
        const { type } = req.query;
        const filter = type ? { type } : {};
        res.json(await Enquiry.find(filter).sort('-createdAt')); 
    }
    catch (error) { res.status(500).json({ error: error.message }); }
};

// Contact Logic
exports.updateContact = async (req, res) => {
    try {
        const contact = await Contact.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json(contact);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getContact = async (req, res) => {
    try { res.json(await Contact.findOne() || {}); }
    catch (error) { res.status(500).json({ error: error.message }); }
};

const slugify = require('slugify');

// Blog CRUD
exports.createBlog = async (req, res) => {
    try {
        const { title } = req.body;
        const slug = slugify(title, { lower: true, strict: true });
        let imageUrl = '';

        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.path, 'hotel_booking/blogs');
            imageUrl = uploaded.url;
            deleteFile(req.file.path);
        }

        const blog = new Blog({ ...req.body, slug, image: imageUrl });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getBlogs = async (req, res) => {
    try { res.json(await Blog.find().sort('-createdAt')); }
    catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (req.body.title) {
            blog.slug = slugify(req.body.title, { lower: true, strict: true });
        }

        if (req.file) {
            if (blog.image) {
                if (isCloudinaryUrl(blog.image)) await deleteFromCloudinary(blog.image);
                else deleteFile(blog.image);
            }
            const uploaded = await uploadToCloudinary(req.file.path, 'hotel_booking/blogs');
            blog.image = uploaded.url;
            deleteFile(req.file.path);
        }

        Object.assign(blog, req.body);
        await blog.save();
        res.json(blog);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// ... Similar for Services, Testimonials, Gallery ...
// Testimonial
exports.createTestimonial = async (req, res) => {
    try {
        console.log('Testimonial Data:', req.body);
        console.log('Testimonial File:', req.file);

        let imageUrl = '';
        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.path, 'hotel_booking/testimonials');
            imageUrl = uploaded.url;
            deleteFile(req.file.path);
        }

        const testimonial = new Testimonial({
            ...req.body,
            image: imageUrl
        });
        await testimonial.save();
        res.status(201).json(testimonial);
    } catch (error) { 
        console.error('Testimonial Creation Error:', error);
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({ message: error.message }); 
    }
};

exports.getTestimonials = async (req, res) => {
    try { res.json(await Testimonial.find()); }
    catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });

        if (req.file) {
            if (testimonial.image) {
                if (isCloudinaryUrl(testimonial.image)) await deleteFromCloudinary(testimonial.image);
                else deleteFile(testimonial.image);
            }
            const uploaded = await uploadToCloudinary(req.file.path, 'hotel_booking/testimonials');
            testimonial.image = uploaded.url;
            deleteFile(req.file.path);
        }

        Object.assign(testimonial, req.body);
        await testimonial.save();
        res.json(testimonial);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Gallery
exports.uploadGallery = async (req, res) => {
    try {
        console.log('Gallery Upload Files:', req.files);
        const images = await Promise.all(req.files.map(async (file) => {
            const uploaded = await uploadToCloudinary(file.path, 'hotel_booking/gallery');
            deleteFile(file.path);
            return { image: uploaded.url };
        }));
        const docs = await Gallery.insertMany(images);
        res.status(201).json(docs);
    } catch (error) { 
        console.error('Gallery Upload Error:', error);
        res.status(500).json({ message: error.message }); 
    }
};

exports.getGallery = async (req, res) => {
    try { res.json(await Gallery.find()); }
    catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteGallery = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (item && item.image) {
            if (isCloudinaryUrl(item.image)) await deleteFromCloudinary(item.image);
            else deleteFile(item.image);
        }
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteTestimonial = async (req, res) => {
    try {
        const item = await Testimonial.findById(req.params.id);
        if (item && item.image) {
            if (isCloudinaryUrl(item.image)) await deleteFromCloudinary(item.image);
            else deleteFile(item.image);
        }
        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ message: 'Testimonial removed' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Facility CRUD
exports.getFacilities = async (req, res) => {
    try { res.json(await Facility.find().sort('-createdAt')); }
    catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createFacility = async (req, res) => {
    try {
        const { title, description, content, icon } = req.body;
        let imageUrl = '';
        let coverImageUrl = '';

        if (req.files && req.files.image) {
            const uploaded = await uploadToCloudinary(req.files.image[0].path, 'hotel_booking/facilities');
            imageUrl = uploaded.url;
            deleteFile(req.files.image[0].path);
        }

        if (req.files && req.files.coverImage) {
            const uploaded = await uploadToCloudinary(req.files.coverImage[0].path, 'hotel_booking/facilities');
            coverImageUrl = uploaded.url;
            deleteFile(req.files.coverImage[0].path);
        }

        const facility = new Facility({
            title,
            description: description || content,
            image: imageUrl,
            coverImage: coverImageUrl,
            icon
        });
        await facility.save();
        res.status(201).json(facility);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateFacility = async (req, res) => {
    try {
        const facility = await Facility.findById(req.params.id);
        if (!facility) return res.status(404).json({ message: 'Facility not found' });

        if (req.files) {
            if (req.files.image) {
                if (facility.image) {
                    if (isCloudinaryUrl(facility.image)) await deleteFromCloudinary(facility.image);
                    else deleteFile(facility.image);
                }
                const uploaded = await uploadToCloudinary(req.files.image[0].path, 'hotel_booking/facilities');
                facility.image = uploaded.url;
                deleteFile(req.files.image[0].path);
            }
            if (req.files.coverImage) {
                if (facility.coverImage) {
                    if (isCloudinaryUrl(facility.coverImage)) await deleteFromCloudinary(facility.coverImage);
                    else deleteFile(facility.coverImage);
                }
                const uploaded = await uploadToCloudinary(req.files.coverImage[0].path, 'hotel_booking/facilities');
                facility.coverImage = uploaded.url;
                deleteFile(req.files.coverImage[0].path);
            }
        }

        const { title, description, content, icon } = req.body;
        if (title !== undefined) facility.title = title;
        if (description !== undefined || content !== undefined) facility.description = description || content;
        if (icon !== undefined) facility.icon = icon;
        
        await facility.save();
        res.json(facility);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteFacility = async (req, res) => {
    try {
        const item = await Facility.findById(req.params.id);
        if (item) {
            if (item.image) {
                if (isCloudinaryUrl(item.image)) await deleteFromCloudinary(item.image);
                else deleteFile(item.image);
            }
            if (item.coverImage) {
                if (isCloudinaryUrl(item.coverImage)) await deleteFromCloudinary(item.coverImage);
                else deleteFile(item.coverImage);
            }
        }
        await Facility.findByIdAndDelete(req.params.id);
        res.json({ message: 'Facility removed' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog && blog.image) {
            if (isCloudinaryUrl(blog.image)) await deleteFromCloudinary(blog.image);
            else deleteFile(blog.image);
        }
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Banner CRUD
exports.getBanners = async (req, res) => {
    try { res.json(await Banner.find().sort('-createdAt')); }
    catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createBanner = async (req, res) => {
    try {
        let imageUrl = '';
        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.path, 'hotel_booking/banners');
            imageUrl = uploaded.url;
            deleteFile(req.file.path);
        }

        const banner = new Banner({
            ...req.body,
            image: imageUrl
        });
        await banner.save();
        res.status(201).json(banner);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });

        if (req.file) {
            if (banner.image) {
                if (isCloudinaryUrl(banner.image)) await deleteFromCloudinary(banner.image);
                else deleteFile(banner.image);
            }
            const uploaded = await uploadToCloudinary(req.file.path, 'hotel_booking/banners');
            banner.image = uploaded.url;
            deleteFile(req.file.path);
        }

        Object.assign(banner, req.body);
        await banner.save();
        res.json(banner);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteBanner = async (req, res) => {
    try {
        const item = await Banner.findById(req.params.id);
        if (item && item.image) {
            if (isCloudinaryUrl(item.image)) await deleteFromCloudinary(item.image);
            else deleteFile(item.image);
        }
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Banner removed' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Offer CRUD
exports.getOffers = async (req, res) => {
    try { res.json(await Offer.find().sort('-createdAt')); }
    catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createOffer = async (req, res) => {
    try {
        const offer = new Offer(req.body);
        await offer.save();
        res.status(201).json(offer);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(offer);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteOffer = async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Offer removed' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
