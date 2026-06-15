const Enquiry = require('../models/Enquiry');
const Contact = require('../models/Contact');
const Blog = require('../models/Blog');
const Facility = require('../models/Facility');
const Testimonial = require('../models/Testimonial');
const Gallery = require('../models/Gallery');
const Notification = require('../models/Notification');
const Banner = require('../models/Banner');
const Offer = require('../models/Offer');
const Category = require('../models/Category');
const ComboOffer = require('../models/ComboOffer');
const { deleteFile } = require('../utils/fileHelper');

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
            imageUrl = req.file.path.replace(/\\/g, '/');
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

exports.getBlogBySlug = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        let blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog && mongoose.Types.ObjectId.isValid(req.params.slug)) {
            blog = await Blog.findById(req.params.slug);
        }
        if (!blog) return res.status(404).json({ message: 'Blog post not found' });
        res.json(blog);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (req.body.title) {
            blog.slug = slugify(req.body.title, { lower: true, strict: true });
        }

        if (req.body.imageCleared === 'true') {
            if (blog.image) {
                deleteFile(blog.image);
                blog.image = '';
            }
        }

        if (req.file) {
            if (blog.image) {
                deleteFile(blog.image);
            }
            blog.image = req.file.path.replace(/\\/g, '/');
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
            imageUrl = req.file.path.replace(/\\/g, '/');
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

        if (req.body.imageCleared === 'true') {
            if (testimonial.image) {
                deleteFile(testimonial.image);
                testimonial.image = '';
            }
        }

        if (req.file) {
            if (testimonial.image) {
                deleteFile(testimonial.image);
            }
            testimonial.image = req.file.path.replace(/\\/g, '/');
        }

        Object.assign(testimonial, req.body);
        await testimonial.save();
        res.json(testimonial);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Gallery
exports.uploadGallery = async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    try {
        console.log('Gallery Upload Files:', req.files);
        
        // Validate each file based on type
        for (const file of req.files) {
            const ext = path.extname(file.originalname).toLowerCase();
            const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
            const isVideo = ['.mp4', '.mov', '.webm'].includes(ext);
            
            if (isImage && file.size > 5000000) {
                // Cleanup files on disk
                req.files.forEach(f => {
                    if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
                });
                return res.status(400).json({ message: `Image ${file.originalname} exceeds the 5MB size limit.` });
            }
            if (isVideo && file.size > 50000000) {
                // Cleanup files on disk
                req.files.forEach(f => {
                    if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
                });
                return res.status(400).json({ message: `Video ${file.originalname} exceeds the 50MB size limit.` });
            }
            if (!isImage && !isVideo) {
                // Cleanup files on disk
                req.files.forEach(f => {
                    if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
                });
                return res.status(400).json({ message: `File ${file.originalname} format is unsupported.` });
            }
        }

        const images = req.files.map((file) => {
            return { image: file.path.replace(/\\/g, '/') };
        });
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
            deleteFile(item.image);
        }
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteTestimonial = async (req, res) => {
    try {
        const item = await Testimonial.findById(req.params.id);
        if (item && item.image) {
            deleteFile(item.image);
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
            imageUrl = req.files.image[0].path.replace(/\\/g, '/');
        }

        if (req.files && req.files.coverImage) {
            coverImageUrl = req.files.coverImage[0].path.replace(/\\/g, '/');
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

        if (req.body.imageCleared === 'true') {
            if (facility.image) {
                if (isCloudinaryUrl(facility.image)) await deleteFromCloudinary(facility.image);
                else deleteFile(facility.image);
                facility.image = '';
            }
        }
        if (req.body.coverImageCleared === 'true') {
            if (facility.coverImage) {
                if (isCloudinaryUrl(facility.coverImage)) await deleteFromCloudinary(facility.coverImage);
                else deleteFile(facility.coverImage);
                facility.coverImage = '';
            }
        }

        if (req.files) {
            if (req.files.image) {
                if (facility.image) {
                    if (isCloudinaryUrl(facility.image)) await deleteFromCloudinary(facility.image);
                    else deleteFile(facility.image);
                }
                facility.image = req.files.image[0].path.replace(/\\/g, '/');
            }
            if (req.files.coverImage) {
                if (facility.coverImage) {
                    if (isCloudinaryUrl(facility.coverImage)) await deleteFromCloudinary(facility.coverImage);
                    else deleteFile(facility.coverImage);
                }
                facility.coverImage = req.files.coverImage[0].path.replace(/\\/g, '/');
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
                deleteFile(item.image);
            }
            if (item.coverImage) {
                deleteFile(item.coverImage);
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
            deleteFile(blog.image);
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
            imageUrl = req.file.path.replace(/\\/g, '/');
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

        if (req.body.imageCleared === 'true') {
            if (banner.image) {
                deleteFile(banner.image);
                banner.image = '';
            }
        }

        if (req.file) {
            if (banner.image) {
                deleteFile(banner.image);
            }
            banner.image = req.file.path.replace(/\\/g, '/');
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
            deleteFile(item.image);
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

// Enquiry Purge endpoint
exports.deleteEnquiry = async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Enquiry deleted successfully' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Category CRUD
exports.getCategories = async (req, res) => {
    try { res.json(await Category.find().sort('-createdAt')); }
    catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createCategory = async (req, res) => {
    try {
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path.replace(/\\/g, '/');
        }

        const category = new Category({
            ...req.body,
            image: imageUrl
        });
        await category.save();
        res.status(201).json(category);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        if (req.body.imageCleared === 'true') {
            if (category.image) {
                deleteFile(category.image);
                category.image = '';
            }
        }

        if (req.file) {
            if (category.image) {
                deleteFile(category.image);
            }
            category.image = req.file.path.replace(/\\/g, '/');
        }

        Object.assign(category, req.body);
        await category.save();
        res.json(category);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category && category.image) {
            deleteFile(category.image);
        }
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category removed' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// ComboOffer CRUD
exports.getComboOffers = async (req, res) => {
    try {
        const offers = await ComboOffer.find().sort('-createdAt');
        res.json(offers);
    }
    catch (error) {
        console.error('getComboOffers API 500 Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.createComboOffer = async (req, res) => {
    try {
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path.replace(/\\/g, '/');
        }

        let includes = [];
        if (req.body.includes) {
            try {
                includes = JSON.parse(req.body.includes);
            } catch (e) {
                includes = typeof req.body.includes === 'string' ? req.body.includes.split(',') : req.body.includes;
            }
        }

        const comboOffer = new ComboOffer({
            ...req.body,
            includes: Array.isArray(includes) ? includes : [includes],
            coverImage: imageUrl
        });
        await comboOffer.save();
        res.status(201).json(comboOffer);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateComboOffer = async (req, res) => {
    try {
        const comboOffer = await ComboOffer.findById(req.params.id);
        if (!comboOffer) return res.status(404).json({ message: 'Combo offer not found' });

        if (req.body.coverImageCleared === 'true') {
            if (comboOffer.coverImage) {
                deleteFile(comboOffer.coverImage);
                comboOffer.coverImage = '';
            }
        }

        if (req.file) {
            if (comboOffer.coverImage) {
                deleteFile(comboOffer.coverImage);
            }
            comboOffer.coverImage = req.file.path.replace(/\\/g, '/');
        }

        if (req.body.includes) {
            let includes = [];
            try {
                includes = JSON.parse(req.body.includes);
            } catch (e) {
                includes = typeof req.body.includes === 'string' ? req.body.includes.split(',') : req.body.includes;
            }
            req.body.includes = Array.isArray(includes) ? includes : [includes];
        }

        Object.assign(comboOffer, req.body);
        await comboOffer.save();
        res.json(comboOffer);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteComboOffer = async (req, res) => {
    try {
        const comboOffer = await ComboOffer.findById(req.params.id);
        if (comboOffer && comboOffer.coverImage) {
            deleteFile(comboOffer.coverImage);
        }
        await ComboOffer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Combo offer removed' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
