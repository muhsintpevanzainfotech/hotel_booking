import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRoomsRequest } from '../redux/slices/roomSlice';
import { Star, MapPin, Users, Waves, Heart, Search, Check, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingModal from '../components/rooms/BookingModal';
import ComboBookingModal from '../components/rooms/ComboBookingModal';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../utils/imageHelper';
import useSEO from '../hooks/useSEO';
import roomsImg from '../assets/images/rooms.jpeg';
import roomImg from '../assets/images/room.jpeg';

const Rooms = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: rooms, loading: loadingRooms, error } = useSelector((state) => state.rooms);
    const [combos, setCombos] = useState([]);
    const [loadingCombos, setLoadingCombos] = useState(true);
    
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [selectedCombo, setSelectedCombo] = useState(null);
    const [isComboModalOpen, setIsComboModalOpen] = useState(false);
    
    const [primaryFilter, setPrimaryFilter] = useState('All');
    const [subCategory, setSubCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useLanguage();

    const sliderRef = useRef(null);

    // Persisted favorites state
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('lake_breeze_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [imageErrors, setImageErrors] = useState({});

    const handleImageError = (itemId) => {
        setImageErrors(prev => ({
            ...prev,
            [itemId]: true
        }));
    };

    const toggleFavorite = (itemId, e) => {
        e.stopPropagation();
        setFavorites(prev => {
            const next = prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId];
            localStorage.setItem('lake_breeze_favorites', JSON.stringify(next));
            return next;
        });
    };

    useSEO(
        t('Luxury stay and Experiences Marketplace', 'लक्जरी प्रवास और अनुभव मार्केटप्लेस', 'ലക്ഷ്വറി സ്റ്റേ & എക്സ്പീരിയൻസ് മാർക്കറ്റ്പ്ലേസ്'),
        t('Discover exquisite sanctuaries and curated experiences. Search rooms and combo packages at Lake Breeze Resorts.', 'कमरे और कॉम्बो पैकेज खोजें।')
    );

    useEffect(() => {
        dispatch(fetchRoomsRequest());
    }, [dispatch]);

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE}/combo-offers`);
                if (res.ok) {
                    const data = await res.json();
                    setCombos(data);
                }
            } catch (err) {
                console.error('Failed to fetch combos:', err);
            } finally {
                setLoadingCombos(false);
            }
        };
        fetchCombos();
    }, []);

    // Combine rooms and combos
    const combinedItems = useMemo(() => {
        const normalizedRooms = rooms.map(room => ({
            ...room,
            isRoom: true,
            displayType: 'Rooms',
            displayName: room.name,
            displayImage: room.images?.[0]?.url ? getImageUrl(room.images[0].url) : '/favicon.png'
        }));

        const normalizedCombos = combos.map(combo => ({
            ...combo,
            isRoom: false,
            displayType: combo.type || 'Combo Package',
            displayName: combo.title,
            displayImage: combo.coverImage ? getImageUrl(combo.coverImage) : '/favicon.png'
        }));

        return [...normalizedRooms, ...normalizedCombos];
    }, [rooms, combos]);

    // Subcategories list based on primary filter
    const subCategories = useMemo(() => {
        if (primaryFilter === 'All') {
            return [
                'All Categories',
                'Deluxe',
                'Suite',
                'Family',
                'Executive',
                'Romantic Escapes',
                'Family Adventures',
                'Executive Retreats',
                'Celebrations & Events'
            ];
        } else if (primaryFilter === 'Rooms') {
            return ['All Rooms', 'Deluxe', 'Suite', 'Family', 'Executive'];
        } else {
            return ['All Packages', 'Romantic Escapes', 'Family Adventures', 'Executive Retreats', 'Celebrations & Events'];
        }
    }, [primaryFilter]);

    // Soft subcategory matching helper
    const matchesSubcategory = (item, sub) => {
        if (!sub || ['All', 'All Rooms', 'All Packages', 'All Categories'].includes(sub)) {
            return true;
        }
        const cleanSub = sub.toLowerCase();
        
        if (item.isRoom) {
            const name = (item.displayName || item.name || '').toLowerCase();
            const type = (item.type || '').toLowerCase();
            return name.includes(cleanSub) || type.includes(cleanSub);
        } else {
            const type = (item.type || '').toLowerCase();
            return type === cleanSub || type.includes(cleanSub);
        }
    };

    // Filtered Items computation
    const filteredItems = useMemo(() => {
        return combinedItems.filter(item => {
            // 1. Primary Filter
            if (primaryFilter === 'Rooms' && !item.isRoom) return false;
            if (primaryFilter === 'Combo Packages' && item.isRoom) return false;

            // 2. Subcategory Filter
            if (!matchesSubcategory(item, subCategory)) return false;

            // 3. Search Filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const titleMatch = (item.displayName || '').toLowerCase().includes(query);
                const categoryMatch = (item.displayType || '').toLowerCase().includes(query) || 
                                      (item.type || '').toLowerCase().includes(query);
                const descMatch = (item.description || '').toLowerCase().includes(query);
                return titleMatch || categoryMatch || descMatch;
            }

            return true;
        });
    }, [combinedItems, primaryFilter, subCategory, searchQuery]);

    const handlePrimaryFilterChange = (filter) => {
        setPrimaryFilter(filter);
        if (filter === 'All') {
            setSubCategory('All');
        } else if (filter === 'Rooms') {
            setSubCategory('All Rooms');
        } else {
            setSubCategory('All Packages');
        }
    };

    const scrollSlider = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 240;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleBookClick = (item) => {
        handleViewClick(item);
    };

    const handleViewClick = (item) => {
        const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
        if (item.isRoom) {
            navigate(`/rooms/${slugify(item.displayName)}`);
        } else {
            navigate(`/packages/${slugify(item.displayName)}`);
        }
    };

    const isLoading = loadingRooms || loadingCombos;

    return (
        <div className="bg-[#F8FAFA] min-h-screen font-body pb-24">
            {/* Page Header */}
            <section className="px-4 py-4 md:px-8 md:py-6 bg-white w-full max-w-[1400px] mx-auto">
                <div className="relative h-[220px] sm:h-[260px] md:h-[320px] rounded-[32px] overflow-hidden flex flex-col justify-center items-center text-center shadow-lg">
                    {/* Background image & Overlay */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img
                            src={roomsImg}
                            alt="Rooms & Experiences Banner"
                            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/95 via-[#0F4C4C]/85 to-[#0F4C4C]/60 backdrop-blur-[2px]" />
                    </div>
                    
                    {/* Header Text Content */}
                    <div className="relative z-10 text-white space-y-4 px-4 sm:px-6">
                        <div className="flex items-center justify-center gap-2 text-[#C5A880]">
                            <Star size={14} className="fill-[#C5A880]" />
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] font-headings">{t('Premium Sanctuary', 'प्रीमियम अभयारण्य', 'പ്രീമിയം സാങ്ച്വറി')}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-none text-white font-headings">
                            {t('Sanctuaries & Experiences', 'अभयारण्य और अनुभव', 'മുറികളും അനുഭവങ്ങളും')}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#C5A880]/80">
                            <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम', 'ഹോം')}</Link>
                            <span>•</span>
                            <span className="text-white">{t('Marketplace', 'मार्केटप्लेस', 'മാർക്കറ്റ്പ്ലേസ്')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Navigation and Search Bar */}
            <div className="sticky top-24 z-30 max-w-[1150px] mx-auto px-6 -mt-8">
                <div className="bg-white/95 backdrop-blur-xl p-5 rounded-[32px] shadow-xl border border-gray-100 flex flex-col gap-4">
                    {/* Top Row: Primary Filter + Search */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                        {/* Primary Filter Pill Control */}
                        <div className="bg-gray-100/70 p-1.5 rounded-full flex gap-1 relative overflow-hidden w-full md:w-auto justify-between md:justify-start">
                            {['All', 'Rooms', 'Combo Packages'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handlePrimaryFilterChange(opt)}
                                    className={`relative z-10 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 rounded-full cursor-pointer flex-1 md:flex-initial text-center ${
                                        primaryFilter === opt 
                                            ? 'text-white' 
                                            : 'text-gray-400 hover:text-gray-700'
                                    }`}
                                >
                                    {primaryFilter === opt && (
                                        <motion.div
                                            layoutId="activePrimaryTab"
                                            className="absolute inset-0 bg-[#0F4C4C] rounded-full -z-10 shadow-sm"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    {t(opt, opt)}
                                </button>
                            ))}
                        </div>

                        {/* Instant Search Bar */}
                        <div className="relative w-full md:w-80 group shrink-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F4C4C] transition-colors" size={15} />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('Search by title, type, or detail...', 'शीर्षक, प्रकार या विवरण खोजें...')}
                                className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-full text-xs font-semibold text-[#0F4C4C] focus:bg-white focus:ring-2 focus:ring-[#C5A880] focus:border-transparent transition-all outline-none"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xs cursor-pointer"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bottom Row: Dynamic Category Slider */}
                    <div className="relative w-full border-t border-gray-100 pt-3 flex items-center group/slider">
                        {/* Scroll masks */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none z-10" />

                        {/* Slider scroll buttons */}
                        <button 
                            onClick={() => scrollSlider('left')}
                            className="absolute left-0 z-20 p-1.5 bg-white border border-gray-100 rounded-full shadow-md text-[#0F4C4C] hover:scale-105 transition-all opacity-0 group-hover/slider:opacity-100 -translate-x-2 cursor-pointer"
                        >
                            <ChevronLeft size={14} />
                        </button>

                        {/* Slider Track */}
                        <div 
                            ref={sliderRef}
                            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 w-full scroll-smooth"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={primaryFilter}
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="flex items-center gap-2"
                                >
                                    {subCategories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSubCategory(cat)}
                                            className={`text-[9px] font-bold uppercase tracking-widest whitespace-nowrap px-4 py-2 transition-all duration-300 relative rounded-full border cursor-pointer select-none ${
                                                subCategory === cat
                                                    ? 'bg-[#FAF6F0] border-[#C5A880] text-[#0F4C4C] font-extrabold shadow-sm'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:text-gray-700 hover:border-gray-200'
                                            }`}
                                        >
                                            {t(cat, cat)}
                                        </button>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <button 
                            onClick={() => scrollSlider('right')}
                            className="absolute right-0 z-20 p-1.5 bg-white border border-gray-100 rounded-full shadow-md text-[#0F4C4C] hover:scale-105 transition-all opacity-0 group-hover/slider:opacity-100 translate-x-2 cursor-pointer"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="max-w-[1150px] mx-auto px-6 py-10">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-white rounded-[32px] border border-gray-50 aspect-[4/5] animate-pulse flex flex-col justify-between p-6">
                                <div className="w-full aspect-[4/3] bg-gray-100 rounded-2xl"></div>
                                <div className="h-6 bg-gray-100 rounded w-2/3 my-4"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/2 mb-6"></div>
                                <div className="h-12 bg-gray-100 rounded-full w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredItems.length > 0 ? (
                            <motion.div 
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filteredItems.map((item) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        key={item._id || item.id} 
                                        className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative"
                                    >
                                        {/* Image Area */}
                                        <div className="relative aspect-[4/3] overflow-hidden cursor-pointer shrink-0 bg-[#FAF6F0] flex items-center justify-center border-b border-gray-100" onClick={() => handleViewClick(item)}>
                                            {item.displayImage && item.displayImage !== '/favicon.png' && !imageErrors[item._id || item.id] ? (
                                                <img 
                                                    src={item.displayImage} 
                                                    alt={item.displayName} 
                                                    onError={() => handleImageError(item._id || item.id)}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                                    id={`card-img-${item._id || item.id}`}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-3 p-6 text-center select-none w-full h-full bg-[#FAF6F0]">
                                                    <img 
                                                        src="/favicon.png" 
                                                        alt="Lake Breeze Resorts Logo" 
                                                        className="w-12 h-12 object-contain opacity-55 transition-all duration-500 group-hover:scale-110" 
                                                    />
                                                    <span className="text-[10px] font-bold text-[#0F4C4C]/45 uppercase tracking-widest">
                                                        {t('Sanctuary Image Unavailable', 'छवि उपलब्ध नहीं है')}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {/* Luxury Transparent Category Badge */}
                                            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest text-[#0F4C4C] border border-[#0F4C4C]/10 shadow-md flex items-center gap-1.5 select-none">
                                                {!item.isRoom && <Gift size={9} className="text-[#C5A880] fill-[#C5A880]" />}
                                                {item.displayType}
                                            </div>

                                            {/* Interactive Favorites Button */}
                                            <button 
                                                className="absolute top-4 right-4 p-2.5 bg-white/40 backdrop-blur-md rounded-full text-white hover:bg-white transition-all shadow-lg group/heart cursor-pointer z-10" 
                                                onClick={(e) => toggleFavorite(item._id || item.id, e)}
                                            >
                                                <Heart 
                                                    size={14} 
                                                    className={`transition-all duration-300 ${
                                                        favorites.includes(item._id || item.id) 
                                                            ? 'fill-red-500 text-red-500 scale-110' 
                                                            : 'text-white group-hover/heart:text-red-400'
                                                    }`} 
                                                />
                                            </button>
                                        </div>
                                        
                                        {/* Content Area */}
                                        <div className="p-6 md:p-7 flex-grow flex flex-col justify-between">
                                            <div className="space-y-3">
                                                {/* Header info */}
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="space-y-1 min-w-0">
                                                        <p className="text-[9px] font-bold text-[#C5A880] uppercase tracking-widest flex items-center gap-1"><MapPin size={9} /> Kumarakom, Kerala</p>
                                                        <h3 className="text-lg md:text-xl font-bold text-[#0F4C4C] tracking-tight leading-snug cursor-pointer hover:text-[#C5A880] transition-colors truncate font-headings" onClick={() => handleViewClick(item)}>{item.displayName}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FAF6F0] rounded-lg border border-[#C5A880]/20 shrink-0">
                                                        <Star size={11} className="text-[#C5A880] fill-[#C5A880]" />
                                                        <span className="text-[10px] font-black text-[#0F4C4C]">4.9</span>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                    {item.description}
                                                </p>

                                                {/* Specifications / Inclusions with Gold theme */}
                                                <div className="py-3 mt-3 border-t border-gray-50 flex-grow">
                                                    {item.isRoom ? (
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                                <Users size={12} className="text-[#C5A880]" />
                                                                {item.capacity} {t('Guests', 'अतिथि')}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                                <Waves size={12} className="text-[#C5A880]" />
                                                                {t('Lake View', 'लेक व्यू')}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">{t('Package Includes:', 'पैकेज में शामिल:')}</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {item.includes?.slice(0, 3).map((inc, index) => (
                                                                    <span key={index} className="px-2 py-1 bg-[#FAF6F0] text-[#0F4C4C] text-[8px] font-bold rounded-lg border border-[#C5A880]/15 uppercase tracking-wider flex items-center gap-1">
                                                                        <Check size={8} className="text-[#C5A880]" />
                                                                        <span className="truncate max-w-[85px]">{inc}</span>
                                                                    </span>
                                                                ))}
                                                                {item.includes && item.includes.length > 3 && (
                                                                    <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[8px] font-bold rounded-lg border border-gray-100 uppercase tracking-wider">
                                                                        +{item.includes.length - 3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Pricing & Buttons at bottom */}
                                            <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between gap-4">
                                                <div className="flex flex-col shrink-0">
                                                    <span className="text-lg md:text-xl font-bold text-[#0F4C4C] tracking-tighter">₹{item.price.toLocaleString()}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                                        {item.isRoom ? t('per night', 'प्रति रात') : t('per package', 'प्रति पैकेज')}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                                    <button 
                                                        onClick={() => handleViewClick(item)}
                                                        className="w-full sm:w-[130px] h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#C5A880] hover:border-[#C5A880] font-semibold uppercase text-[9px] tracking-widest hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
                                                    >
                                                        {t('View Details', 'विवरण देखें')}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleBookClick(item)}
                                                        className="w-full sm:w-[130px] h-10 rounded-full bg-white border border-[#0F4C4C]/40 text-[#0F4C4C] font-semibold uppercase text-[9px] tracking-widest hover:-translate-y-0.5 hover:shadow-md hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880] transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
                                                    >
                                                        {item.isRoom ? t('Book Now', 'अभी बुक करें') : t('Book Package', 'पैकेज बुक करें')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-16 text-center max-w-lg mx-auto">
                                <Search size={40} className="mx-auto text-[#C5A880] opacity-30 mb-6" />
                                <h3 className="text-2xl font-bold text-[#0F4C4C] mb-2">{t('No Sanctuaries Found', 'कोई अभयारण्य नहीं मिला')}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{t('We couldn\'t find any rooms or experiences matching your query. Please try another search.', 'आपके खोज के लिए कोई कमरे या पैकेज नहीं मिले।')}</p>
                            </div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            <BookingModal 
                isOpen={isRoomModalOpen} 
                onClose={() => setIsRoomModalOpen(false)} 
                room={selectedRoom} 
            />
            <ComboBookingModal 
                isOpen={isComboModalOpen} 
                onClose={() => setIsComboModalOpen(false)} 
                combo={selectedCombo} 
            />
        </div>
    );
};

export default Rooms;
