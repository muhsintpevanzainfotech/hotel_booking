import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, User, ChevronLeft, ChevronRight, Play, X, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Blog = () => {
  const { t } = useLanguage();
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sliderIndex, setSliderIndex] = useState(0);
  
  // Video Modal state
  const [videoOpen, setVideoOpen] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock Blog Posts
  const initialPosts = [
    {
      id: 1,
      type: 'standard',
      image: '/hero.jpg',
      author: 'Robert Fox',
      date: 'Sep 09, 2026',
      title: 'The Ultimate Guide to Hassle Free Hotel Booking',
      description: 'Lorem ipsum dolor sit amet consectetur. Felis velit congue ac aliquam nunc vulputate id. Morbi rutrum aliquet nec malesuada commodo turpis. Integer semper adipiscing nunc eu tempor. Faucibus platea id rhoncus sem varius dui nibh tortor dui amet.',
      category: 'Hotel Booking',
      tags: ['Hotel', 'Booking', 'Vacation']
    },
    {
      id: 2,
      type: 'slider',
      images: [
        '/room_family.png',
        '/room_deluxe.png',
        '/room1.jpg'
      ],
      author: 'Robert Fox',
      date: 'Sep 12, 2026',
      title: 'Top 10 Tips to Find the Perfect Hotel for Your Next Trip',
      description: 'Lorem ipsum dolor sit amet consectetur. Felis velit congue ac aliquam nunc vulputate id. Morbi rutrum aliquet nec malesuada commodo turpis. Integer semper adipiscing nunc eu tempor. Faucibus platea id rhoncus sem varius dui nibh tortor dui amet.',
      category: 'Holiday',
      tags: ['Hotel', 'Trip', 'Planning']
    },
    {
      id: 3,
      type: 'video',
      image: '/sustainable_luxury_garden_1778950196361.png',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video
      author: 'Robert Fox',
      date: 'Sep 18, 2026',
      title: 'Wonderful 17 places you cannot ignore in Paris',
      description: 'Lorem ipsum dolor sit amet consectetur. Felis velit congue ac aliquam nunc vulputate id. Morbi rutrum aliquet nec malesuada commodo turpis. Integer semper adipiscing nunc eu tempor. Faucibus platea id rhoncus sem varius dui nibh tortor dui amet.',
      category: 'Destination',
      tags: ['Destination', 'Beautiful', 'Road Trip']
    },
    {
      id: 4,
      type: 'standard',
      image: '/hero_bright.png',
      author: 'Robert Fox',
      date: 'Sep 23, 2026',
      title: 'Offers Exclusive Services & Facilities to Guests',
      description: 'Lorem ipsum dolor sit amet consectetur. Felis velit congue ac aliquam nunc vulputate id. Morbi rutrum aliquet nec malesuada commodo turpis. Integer semper adipiscing nunc eu tempor. Faucibus platea id rhoncus sem varius dui nibh tortor dui amet.',
      category: 'Events',
      tags: ['Room', 'Destination', 'Vacation']
    }
  ];

  // Sidebar Mock Data
  const categories = [
    { name: 'Holiday', count: 23 },
    { name: 'Hotel Booking', count: 8 },
    { name: 'Destination', count: 18 },
    { name: 'Vacation', count: 14 },
    { name: 'Tour', count: 2 },
    { name: 'Events', count: 14 }
  ];

  const recentPosts = [
    {
      id: 1,
      title: 'Top 6 Hotel Trends to Watch',
      date: 'Nov 25, 2026',
      image: '/room_deluxe.png'
    },
    {
      id: 2,
      title: 'Booking Your Family vacation in Japan',
      date: 'Nov 17, 2026',
      image: '/room_family.png'
    },
    {
      id: 3,
      title: 'Exclusive Services & Season\'s Offers',
      date: 'Nov 09, 2026',
      image: '/room1.jpg'
    },
    {
      id: 4,
      title: 'Merging Nature with Luxury Hotel',
      date: 'Nov 02, 2026',
      image: '/sustainable_luxury_garden_1778950196361.png'
    }
  ];

  const tags = [
    'Restaurant', 'Road Trip', 'Planning', 'Hotel', 'Vacation',
    'Destination', 'Booking', 'Beautiful', 'Room', 'Trip'
  ];

  // Filter Logic
  const filteredPosts = initialPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Simple slider handlers
  const handlePrevSlide = (imagesLength) => {
    setSliderIndex((prev) => (prev === 0 ? imagesLength - 1 : prev - 1));
  };

  const handleNextSlide = (imagesLength) => {
    setSliderIndex((prev) => (prev === imagesLength - 1 ? 0 : prev + 1));
  };

  // Pagination constants
  const postsPerPage = 2;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="bg-[#F8FAFA] min-h-screen">
      
      {/* 1. HERO HEADER CARD */}
      <section className="px-4 py-4 md:px-8 md:py-6 bg-white">
        <div className="relative h-[200px] sm:h-[250px] md:h-[350px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col justify-center items-center text-center shadow-md">
          {/* Background image & Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="/hero.jpg"
              alt="Latest News Banner"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#0F4C4C]/75 backdrop-blur-[2px]" />
          </div>
          
          {/* Header Text Content */}
          <div className="relative z-10 text-white space-y-3 px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight">
              {t('Latest News', 'नवीनतम समाचार')}
            </h1>
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-teal-200">
              <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम')}</Link>
              <span>•</span>
              <span className="text-white">{t('Blog', 'ब्लॉग')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BLOG CONTENT & SIDEBAR GRID */}
      <section className="py-8 sm:py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 w-full">
          
          {/* Left Column: Posts List & Pagination */}
          <div className="lg:col-span-8 space-y-16">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <motion.article 
                  key={post.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 group"
                >
                  {/* Post Image Container */}
                  <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden bg-gray-100 shadow-sm aspect-[16/10] sm:aspect-[16/9]">
                    
                    {/* Render according to type */}
                    {post.type === 'slider' ? (
                      <div className="relative w-full h-full">
                        <img
                          src={post.images[sliderIndex]}
                          alt={post.title}
                          className="w-full h-full object-cover transition-all duration-700"
                        />
                        {/* Slide Left Button */}
                        <button
                          onClick={() => handlePrevSlide(post.images.length)}
                          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-800 hover:bg-[#0f4c4c] hover:text-white transition-all active:scale-95 z-10 cursor-pointer"
                        >
                          <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                        </button>
                        {/* Slide Right Button */}
                        <button
                          onClick={() => handleNextSlide(post.images.length)}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-800 hover:bg-[#0f4c4c] hover:text-white transition-all active:scale-95 z-10 cursor-pointer"
                        >
                          <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    ) : post.type === 'video' ? (
                      <div className="relative w-full h-full cursor-pointer" onClick={() => setVideoOpen(true)}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors hover:bg-black/30">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all text-[#0F4C4C]">
                            <Play size={18} className="fill-current ml-0.5 sm:ml-1 sm:w-6 sm:h-6" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Standard / Default Image Post
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]"
                      />
                    )}
                  </div>

                  {/* Post Details & Excerpt */}
                  <div className="space-y-3 sm:space-y-4 px-1 sm:px-2">
                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">
                      <div className="flex items-center gap-1.5 hover:text-[#0F4C4C] cursor-pointer">
                        <User size={12} className="text-[#0F4C4C]" />
                        <span>By {post.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#0F4C4C]" />
                        <span>Date: {post.date}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug group-hover:text-[#0F4C4C] transition-colors cursor-pointer">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-3xl">
                      {post.description}
                    </p>

                    {/* Read More link */}
                    <div className="pt-1">
                      <Link 
                        to="#"
                        onClick={(e) => e.preventDefault()}
                        className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#0f4c4c] hover:text-[#0f4c4c]/70 transition-colors border-b-2 border-[#0f4c4c] pb-0.5"
                      >
                        {t('Read More.', 'और पढ़ें।')}
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
                <BookOpen size={48} className="mx-auto text-gray-300" />
                <p className="text-gray-500 text-sm font-semibold">No posts found matching the filters.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedTag('All');
                  }} 
                  className="px-6 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2.5 pt-8">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 font-black text-xs uppercase transition-all duration-200 border rounded flex items-center justify-center cursor-pointer ${
                      currentPage === i + 1
                        ? 'bg-black text-white border-black shadow-md'
                        : 'bg-white text-slate-700 border-gray-200 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="w-10 h-10 font-black text-xs border border-gray-200 bg-white text-slate-700 rounded flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    &gt;
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar Widgets */}
          <aside className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-y-12 lg:gap-x-0">
            
            {/* Widget 1: Search */}
            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 border-b border-gray-100 pb-3">{t('Search Here', 'यहाँ खोजें')}</h3>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:border-slate-400 transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search Post..."
                  className="w-full px-5 py-3.5 text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent border-none focus:outline-none focus:ring-0"
                />
                <button className="bg-black text-white px-5 flex items-center justify-center hover:bg-slate-900 active:scale-95 transition-all">
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* Widget 2: Category Filter */}
            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-black text-slate-900">{t('Category', 'श्रेणी')}</h3>
                {selectedCategory !== 'All' && (
                  <button 
                    onClick={() => setSelectedCategory('All')} 
                    className="text-[9px] font-black uppercase text-teal-600 tracking-wider hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <ul className="space-y-4">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all ${
                        selectedCategory === cat.name
                          ? 'bg-[#0F4C4C]/10 text-[#0F4C4C] font-black pl-5'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] text-gray-400 ${selectedCategory === cat.name ? 'text-[#0F4C4C]' : ''}`}>
                        ({cat.count < 10 ? `0${cat.count}` : cat.count})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget 3: Recent Posts */}
            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 border-b border-gray-100 pb-3">{t('Recent Post', 'हालिया पोस्ट')}</h3>
              <div className="space-y-5">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex gap-4 items-center group cursor-pointer">
                    {/* Small thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 shadow-sm relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Info */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-[#0F4C4C] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {post.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 4: Popular Tags */}
            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-black text-slate-900">{t('Popular Tags', 'लोकप्रिय टैग')}</h3>
                {selectedTag !== 'All' && (
                  <button 
                    onClick={() => setSelectedTag('All')} 
                    className="text-[9px] font-black uppercase text-teal-600 tracking-wider hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {tags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedTag(tag);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${
                      selectedTag === tag
                        ? 'bg-black text-white border-black shadow-md scale-95'
                        : 'bg-white text-slate-500 border-gray-200 hover:border-slate-400 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
          </aside>

        </div>
      </section>

      {/* 3. VIDEO POPUP MODAL */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          >
            {/* Close button */}
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            >
              <X size={24} />
            </button>
            
            {/* Video container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-[1000px] aspect-[16/9] rounded-2xl overflow-hidden bg-black shadow-2xl relative"
            >
              <iframe
                title="Blog Video"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Blog;
