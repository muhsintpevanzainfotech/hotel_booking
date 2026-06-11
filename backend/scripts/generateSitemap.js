const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Room = require('../models/Room');
const Blog = require('../models/Blog');

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

async function generateSitemap() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected successfully.');

        console.log('Fetching active rooms and blogs...');
        const rooms = await Room.find({}, 'name updatedAt');
        const blogs = await Blog.find({}, 'slug updatedAt');
        
        console.log(`Found ${rooms.length} rooms and ${blogs.length} blogs.`);

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add static pages
        console.log('Adding static pages...');
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

        // Add room pages
        console.log('Adding room pages...');
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

        // Add blog pages
        console.log('Adding blog pages...');
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

        console.log(`Writing sitemap to ${outputPath}...`);
        fs.writeFileSync(outputPath, xml, 'utf8');
        console.log('Sitemap generated successfully!');
    } catch (error) {
        console.error('Error generating sitemap:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected.');
    }
}

generateSitemap();
