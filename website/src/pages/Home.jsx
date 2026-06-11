import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomsRequest } from '../redux/slices/roomSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, MapPin, Waves, Users, Zap, Shield, Check, Phone, MessageCircle, Home as HomeIcon, Layout, CreditCard, Sparkles, Coffee, Utensils, Wifi, Wind, Car, Camera, Quote, CalendarDays, Bed, User, Baby, Key, ArrowRight, Flag, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Tag, Copy, Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageHelper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import useSEO from '../hooks/useSEO';
import toast from 'react-hot-toast';
import 'swiper/css';
import heroVideo from '../assets/images/hero.mp4';
import bathroomImg from '../assets/images/bathroom.jpeg';
import bgImg from '../assets/images/bg.jpeg';
import coupleImg from '../assets/images/couple.jpeg';
import familyImg from '../assets/images/family.jpeg';
import familyroomImg from '../assets/images/familyroom.jpeg';
import maeterImg from '../assets/images/maeter.jpeg';
import masterImg from '../assets/images/master.jpeg';
import masterbedroomImg from '../assets/images/masterbedroom.jpeg';
import masterbedroom2Img from '../assets/images/masterbedroom2.jpeg';
import roomImg from '../assets/images/room.jpeg';
import roomsImg from '../assets/images/rooms.jpeg';
import sitoutImg from '../assets/images/sitout.jpeg';
import BookingModal from '../components/rooms/BookingModal';
import { AnimatePresence } from 'framer-motion';

const RoomCard = ({ room, index, onBookClick, t }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const images = room.images && room.images.length > 0 
    ? room.images.map(img => getImageUrl(img.url))
    : [roomImg];

  useEffect(() => {
    if (isHovered && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 2500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCurrentImageIndex(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isHovered, images.length]);

  const handleDotClick = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(idx);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (isHovered && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 2500);
    }
  };

  const handlePrevClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleNextClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(prev => (prev + 1) % images.length);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const isDark = index % 2 !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl border border-white/10 transition-all duration-500 bg-slate-950"
    >
      {/* Zoomable & Shrinkable Image Container (Hover Enter Trigger) */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        className="absolute top-0 left-0 right-0 w-full overflow-hidden z-10"
        animate={{ 
          height: isHovered ? '58%' : '100%',
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={room.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Dark Gradient Overlay over image */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none z-10 transition-opacity duration-500"
          style={{ opacity: isHovered ? 0.3 : 0.8 }}
        />

        {/* Carousel manual arrows (Chevrons, visible on hover) */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={handlePrevClick}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.3 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors z-20 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={14} />
            </motion.button>
            <motion.button
              onClick={handleNextClick}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors z-20 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={14} />
            </motion.button>
          </>
        )}

        {/* Carousel dot indicators (always visible at bottom of image) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20 px-2 py-1 bg-black/30 backdrop-blur-md rounded-full">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(e, idx)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  currentImageIndex === idx 
                    ? 'w-3 bg-white' 
                    : 'w-1 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Product Category Tag - Small luxury indicator at the top left of the image */}
        <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/35 backdrop-blur-md border border-white/10 rounded-full text-[7px] font-bold uppercase tracking-widest text-white z-20 shadow-sm">
          {room.type}
        </div>
      </motion.div>

      {/* Frosted Glass Content Panel */}
      <motion.div
        animate={{
          height: isHovered ? '42%' : '38%',
          backgroundColor: isHovered ? (isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.15)') : 'rgba(15, 23, 42, 0)',
          backdropFilter: isHovered ? 'blur(16px)' : 'blur(0px)',
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)'
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-5 flex flex-col justify-between text-white border-t"
      >
        {/* Row 1: Title and Price Badge */}
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-sm sm:text-base font-bold tracking-tight truncate leading-tight flex-1">
            {room.name}
          </h3>
          <span className="shrink-0 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-tight shadow-md bg-white text-slate-950">
            ₹{room.price.toLocaleString()}
          </span>
        </div>

        {/* Row 2: Short Description */}
        <p className="text-[9px] sm:text-[10px] text-white/80 font-normal leading-relaxed line-clamp-2 overflow-hidden mt-1 sm:mt-1.5">
          {room.description || t('Experience unparalleled luxury and serenity in our premium resort room designed for ultimate comfort.', 'അംതിമ് आराम के लिए डिज़ाइन किए गए हमारे premium റിസോർട്ട് മുറിയിൽ അതിവിശിഷ്ടമായ സൗകര്യം അനുഭവിക്കുക.')}
        </p>

        {/* Row 3: Category tags (Facilities) */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 overflow-hidden mt-1 sm:mt-2">
          <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/10 border border-white/10 text-white">
            {room.capacity || 2} Guests
          </span>
          <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/10 border border-white/10 text-white">
            Lake View
          </span>
          {room.quantity <= 3 && (
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-red-500/20 border border-red-500/20 text-red-200">
              Only {room.quantity} left
            </span>
          )}
        </div>

        {/* Row 4: Book CTA Button */}
        <div className="pt-1.5 sm:pt-2 border-t border-white/10 mt-1 sm:mt-2">
          <motion.button
            animate={{ scale: isHovered ? 1.02 : 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}
            onClick={(e) => {
              e.stopPropagation();
              onBookClick(room);
            }}
            className="w-full py-2 sm:py-2.5 bg-white text-slate-950 hover:bg-slate-100 rounded-full font-black uppercase text-[7px] sm:text-[8px] tracking-[0.2em] shadow-md transition-colors duration-300 active:scale-[0.98] cursor-pointer"
          >
            {t('Book Now', 'अभी बुक करें')}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ComboOfferCard = ({ combo, index, t }) => {
  const handleCardClick = () => {
    if (combo.links) {
      if (combo.links.startsWith('http')) {
        window.open(combo.links, '_blank');
      } else {
        window.location.href = combo.links;
      }
    } else {
      window.location.href = `/contact?subject=Booking ${combo.title}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
      className="relative w-full h-[400px] sm:h-[420px] rounded-[32px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl border border-white/10 transition-all duration-300 group bg-slate-950"
    >
      {/* Background Cover Image */}
      <img
        src={combo.coverImage ? getImageUrl(combo.coverImage) : sitoutImg}
        alt={combo.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Dark Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />

      {/* Floating Card Content Overlay */}
      <div className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-end text-white">
        <div className="space-y-3">
          {/* Package Type Badge */}
          <div className="inline-flex px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[8px] font-black uppercase tracking-widest text-white">
            {combo.type || t('Package', 'पैकेज')}
          </div>

          {/* Title and Price */}
          <div className="flex justify-between items-end gap-3">
            <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug group-hover:text-teal-300 transition-colors line-clamp-2">
              {combo.title}
            </h3>
            <span className="shrink-0 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-tight shadow-md bg-teal-500 text-white">
              ₹{combo.price.toLocaleString()}
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-white/80 font-normal leading-relaxed line-clamp-2">
            {combo.description}
          </p>

          {/* Included Items Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {combo.includes && combo.includes.slice(0, 3).map((inc, idx) => (
              <span key={idx} className="text-[7.5px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/95">
                {inc}
              </span>
            ))}
            {combo.includes && combo.includes.length > 3 && (
              <span className="text-[7.5px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                +{combo.includes.length - 3} More
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const dispatch = useDispatch();

  useSEO(
    'Lake Breeze Resorts | Ultra-Luxury Waterfront Sanctuary',
    'Experience unrivaled luxury at Lake Breeze Resorts. A sanctuary where architectural brilliance meets the wild beauty of the valley. Book your signature suite today.'
  );
  const { items: allRooms, loading } = useSelector(state => state.rooms);
  const { t } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [comboOffers, setComboOffers] = useState([]);

  const defaultMockComboOffers = [
    {
      _id: 'mock-combo-1',
      title: t('Backwater Romance Honeymoon Escape', 'बैकवाटर रोमांस हनीमून एस्केप'),
      type: t('Honeymoon', 'हनीमून'),
      price: 14999,
      description: t('Indulge in a romantic escape designed for couples. Includes a decorated waterfront suite, special backwater sunset cruise, candlelight lakeside dining, and a couple spa session.', 'युगलों के लिए डिज़ाइन किए गए रोमांटिक पलायन का आनंद लें। इसमें एक सजा हुआ वाटरफ्रंट सुइट, विशेष बैकवाटर सनसेट क्रूज़, मोमबत्ती की रोशनी में झील के किनारे भोजन और एक युगल स्पा सत्र शामिल है।'),
      includes: [t('Waterfront Suite', 'वाटरफ्रंट सुइट'), t('Sunset Cruise', 'सनसेट क्रूज़'), t('Candlelight Dinner', 'कैंडललाइट डिनर'), t('Ayurvedic Spa', 'आयुर्वेदिक स्पा')],
      coverImage: coupleImg,
      links: '/contact?subject=Honeymoon Package Booking'
    },
    {
      _id: 'mock-combo-2',
      title: t('Family Weekend Explorer Package', 'फैमिली वीकेंड एक्सप्लोरर पैकेज'),
      type: t('Family Package', 'पारिवारिक पैकेज'),
      price: 24999,
      description: t('Create unforgettable family memories. Savor traditional Kerala lunch, embark on a village canoe tour, enjoy water sports, and enjoy a guided morning bird-watching walk.', 'अविस्मरणीय पारिवारिक यादें बनाएं। पारंपरिक केरल दोपहर के भोजन का स्वाद लें, एक ग्रामीण डोंगी यात्रा पर निकलें, पानी के खेल का आनंद लें और एक निर्देशित सुबह पक्षी-दर्शन सैर का आनंद लें।'),
      includes: [t('Family Suite', 'पारिवारिक सुइट'), t('Traditional Lunch', 'पारंपरिक लंच'), t('Canoe Tour', 'डोंगी यात्रा'), t('Bird Watching', 'पक्षी देखना')],
      coverImage: familyImg,
      links: '/contact?subject=Family Package Booking'
    },
    {
      _id: 'mock-combo-3',
      title: t('Rejuvenating Wellness Spa Retreat', 'कायाकल्प कल्याण स्पा रिट्रीट'),
      type: t('Wellness', 'कल्याण'),
      price: 18999,
      description: t('Rebalance your body and mind with our ayurvedic wellness treatment. Includes lake view luxury accommodation, daily sunrise yoga sessions, specialized treatments, and organic organic meals.', 'हमारे आयुर्वेदिक कल्याण उपचार के साथ अपने शरीर और दिमाग को फिर से संतुलित करें। इसमें झील के दृश्य के साथ लक्जरी आवास, दैनिक सूर्योदय योग सत्र, विशेष उपचार और जैविक जैविक भोजन शामिल हैं।'),
      includes: [t('Lake View Room', 'झील दृश्य कमरा'), t('Sunrise Yoga', 'सूर्योदय योग'), t('Spa Therapy', 'स्पा थेरेपी'), t('Organic Meals', 'जैविक भोजन')],
      coverImage: sitoutImg,
      links: '/contact?subject=Spa Package Booking'
    }
  ];

  const displayComboOffers = comboOffers.length > 0
    ? [
        ...comboOffers,
        ...defaultMockComboOffers.filter(mock => !comboOffers.some(real => real.title === mock.title))
      ].slice(0, 3)
    : defaultMockComboOffers;

  const [exclusiveOffers, setExclusiveOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  const filteredRooms = allRooms.filter(room => {
    if (selectedCategory === 'All') return true;
    return room.type === selectedCategory;
  });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(t('Promo code copied!', 'प्रोमो कोड कॉपी किया गया!'));
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const [facilities, setFacilities] = useState([]);
  const defaultFacilities = [
    {
      title: t('Restaurants', 'रेस्तरां'),
      description: t('The unique flavors will find in our restaurant will bring you one step closer to feeling like a local and homemade.', 'हमारे रेस्तरां में मिलने वाले अनोखे स्वाद आपको घरेलू और स्थानीय महसूस कराने के करीब लाएंगे।'),
      icon: 'restaurant'
    },
    {
      title: t('24/7 Room Services', '24/7 कमरा सेवा'),
      description: t('The unique flavors will find in our restaurant will bring you one step closer to feeling like a local and homemade.', 'हमारे रेस्तरां में मिलने वाले अनोखे स्वाद आपको घरेलू और स्थानीय महसूस कराने के करीब लाएंगे।'),
      icon: 'bed'
    },
    {
      title: t('Breakfast', 'नाश्ता'),
      description: t('The unique flavors will find in our restaurant will bring you one step closer to feeling like a local and homemade.', 'हमारे रेस्तरां में मिलने वाले अनोखे स्वाद आपको घरेलू और स्थानीय महसूस कराने के करीब लाएंगे।'),
      icon: 'coffee'
    },
    {
      title: t('Tour Guide', 'यात्रा गाइड'),
      description: t('The unique flavors will find in our restaurant will bring you one step closer to feeling like a local and homemade.', 'हमारे रेस्तरां में मिलने वाले अनोखे स्वाद आपको घरेलू और स्थानीय महसूस कराने के करीब लाएंगे।'),
      icon: 'flag'
    }
  ];
  const displayFacilities = facilities.length > 0 ? facilities : defaultFacilities;
  const [testimonials, setTestimonials] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [banners, setBanners] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    dispatch(fetchRoomsRequest());

    const fetchContent = async () => {
      try {
        const [facRes, testRes, galRes, banRes, blogRes, comboRes, offerRes, catRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE}/facilities`),
          fetch(`${import.meta.env.VITE_API_BASE}/testimonials`),
          fetch(`${import.meta.env.VITE_API_BASE}/gallery`),
          fetch(`${import.meta.env.VITE_API_BASE}/banners`),
          fetch(`${import.meta.env.VITE_API_BASE}/blogs`),
          fetch(`${import.meta.env.VITE_API_BASE}/combo-offers`),
          fetch(`${import.meta.env.VITE_API_BASE}/offers`),
          fetch(`${import.meta.env.VITE_API_BASE}/categories`)
        ]);

        if (facRes.ok) setFacilities(await facRes.json());
        if (testRes.ok) setTestimonials(await testRes.json());
        if (galRes.ok) {
          const gallery = await galRes.json();
          setGalleryItems(gallery.slice(0, 6));
        }
        if (banRes.ok) setBanners(await banRes.json());
        if (blogRes && blogRes.ok) setBlogs(await blogRes.json());
        if (comboRes && comboRes.ok) setComboOffers(await comboRes.json());
        if (offerRes && offerRes.ok) setExclusiveOffers(await offerRes.json());
        if (catRes && catRes.ok) {
          const allCats = await catRes.json();
          setCategories(allCats.filter(c => c.type === 'room'));
        }
      } catch (error) {
        console.error("Failed to fetch home content", error);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchContent();
  }, [dispatch]);

  const navigate = useNavigate();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const handleCheckInClick = () => {
    if (checkInRef.current) {
      try {
        checkInRef.current.showPicker();
      } catch (e) {
        console.warn("showPicker is not supported", e);
      }
    }
  };

  const handleCheckOutClick = () => {
    if (checkOutRef.current) {
      try {
        checkOutRef.current.showPicker();
      } catch (e) {
        console.warn("showPicker is not supported", e);
      }
    }
  };

  const adultRef = useRef(null);
  const childrenRef = useRef(null);
  const roomsRef = useRef(null);

  const handleAdultClick = () => {
    if (adultRef.current) {
      adultRef.current.focus();
      try {
        adultRef.current.select();
      } catch (e) { }
    }
  };

  const handleChildrenClick = () => {
    if (childrenRef.current) {
      childrenRef.current.focus();
      try {
        childrenRef.current.select();
      } catch (e) { }
    }
  };

  const handleRoomsClick = () => {
    if (roomsRef.current) {
      roomsRef.current.focus();
      try {
        roomsRef.current.select();
      } catch (e) { }
    }
  };

  const [checkIn, setCheckIn] = useState(formatDate(today));
  const [checkOut, setCheckOut] = useState(formatDate(tomorrow));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);

  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => {
          setIsVideoPlaying(true);
        }).catch(err => {
          console.error("Playback failed", err);
        });
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const handleMuteUnmute = () => {
    if (videoRef.current) {
      const newMuted = !isVideoMuted;
      videoRef.current.muted = newMuted;
      setIsVideoMuted(newMuted);
    }
  };

  const handleBookingSubmit = () => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
      rooms: String(roomsCount)
    }).toString();

    navigate(`/rooms?${params}`);
  };

  const defaultMockBlogs = [
    {
      id: 1,
      slug: 'ultimate-guide-to-hassle-free-hotel-booking',
      image: masterbedroomImg,
      author: 'Robert Fox',
      date: 'Sep 09, 2026',
      title: t('The Ultimate Guide to Hassle Free Hotel Booking', 'हॉस्टल फ्री होटल बुकिंग के लिए अंतिम गाइड'),
      desc: 'Lorem ipsum dolor sit amet consectetur. Felis velit congue ac aliquam nunc vulputate id. Morbi rutrum aliquet nec malesuada commodo...',
    },
    {
      id: 2,
      slug: 'top-10-tips-to-find-perfect-hotel',
      image: familyroomImg,
      author: 'Robert Fox',
      date: 'Sep 12, 2026',
      title: t('Top 10 Tips to Find the Perfect Hotel for Your Next Trip', 'आपकी अगली यात्रा के लिए सही होटल खोजने के लिए शीर्ष 10 युक्तियाँ'),
      desc: 'Lorem ipsum dolor sit amet consectetur. Felis velit congue ac aliquam nunc vulputate id. Morbi rutrum aliquet nec malesuada commodo...',
    },
    {
      id: 3,
      slug: 'wonderful-17-places-in-paris',
      image: bathroomImg,
      author: 'Robert Fox',
      date: 'Sep 18, 2026',
      title: t('Wonderful 17 places you cannot ignore in Paris', 'पेरिस में अद्भुत 17 स्थान जिन्हें आप अनदेखा नहीं कर सकते'),
      desc: 'Lorem ipsum dolor sit amet consectetur. Felis velit congue ac aliquam nunc vulputate id. Morbi rutrum aliquet nec malesuada commodo...',
    }
  ];

  const displayBlogs = blogs.length > 0
    ? [
      ...blogs.map(b => ({
        id: b._id,
        slug: b.slug || b._id,
        image: b.image,
        author: b.author || 'Admin',
        date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        title: b.title,
        desc: b.content
      })),
      ...defaultMockBlogs
    ].slice(0, 3)
    : defaultMockBlogs;

  return (
    <div className="bg-[#F8FAFA] min-h-screen font-poppins pb-24 md:pb-0">
      {/* 1. HERO SECTION */}
      <section className="px-4 py-4 md:px-8 md:py-6 bg-white relative overflow-visible">
        <div className="relative min-h-[92vh] rounded-[48px] bg-gradient-to-b from-[#A5C5E8] to-[#FFFFFF] shadow-md flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16 pb-[280px] sm:pb-48 lg:pb-36 overflow-visible">

          {/* Clip container for background image and overlays */}
          <div className="absolute inset-0 rounded-[48px] overflow-hidden z-0 pointer-events-none">
            <img
              src={bgImg}
              alt="Luxury villa resort"
              className="absolute inset-0 w-full h-full object-cover object-bottom mix-blend-normal z-0"
            />
            {/* Subtle gradient overlay to protect text readability */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#A5C5E8]/60 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-0 bg-black/5 pointer-events-none z-10" />
          </div>

          {/* Text Container */}
          <div className="relative z-10 w-full pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
              <div className="lg:col-span-8">
                <h1 className="text-white text-5xl sm:text-7xl lg:text-[7.2rem] font-semibold tracking-tight leading-none">
                  {t('Stay with comfort', 'आराम के साथ रहें')}
                </h1>
              </div>
              <div className="lg:col-span-4 lg:self-end lg:pt-12">
                <p className="text-white text-sm leading-relaxed max-w-sm lg:ml-auto">
                  {t(
                    'Welcome — where comfort meets elegance and every guest feels at home. Our doors are always open to warmth, comfort, and unforgettable memories.',
                    'स्वागत है - जहां आराम लालित्य से मिलता है और हर अतिथि घर जैसा महसूस करता है। हमारे दरवाजे गर्मी, आराम और अविस्मरणीय यादों के लिए हमेशा खुले हैं।'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Search/Booking Widget Wrapper - absolute positioned down to overlay bottom border */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-[calc(100%-2rem)] max-w-[1080px] px-4">
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="flex flex-col items-center w-full"
            >
              <div className="w-full bg-white p-5 rounded-[32px] md:rounded-[40px] shadow-[0_30px_100px_-24px_rgba(15,23,42,0.2)] border border-slate-100/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                  {/* Check In */}
                  <div
                    onClick={handleCheckInClick}
                    className="relative rounded-full border border-slate-200/80 bg-white px-5 py-3.5 flex items-center gap-3 shadow-sm hover:border-slate-350 hover:bg-slate-50 transition duration-150 cursor-pointer"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                      <CalendarDays size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t('Check in', 'चेक-इन')}</span>
                      <span className="text-sm font-semibold text-slate-800">{formatDisplayDate(checkIn)}</span>
                    </div>
                    <input
                      ref={checkInRef}
                      type="date"
                      min={formatDate(today)}
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (checkOut && new Date(e.target.value) >= new Date(checkOut)) {
                          const nextDay = new Date(e.target.value);
                          nextDay.setDate(nextDay.getDate() + 1);
                          setCheckOut(formatDate(nextDay));
                        }
                      }}
                      className="absolute inset-0 opacity-0 w-full h-full pointer-events-none"
                    />
                  </div>

                  {/* Check Out */}
                  <div
                    onClick={handleCheckOutClick}
                    className="relative rounded-full border border-slate-200/80 bg-white px-5 py-3.5 flex items-center gap-3 shadow-sm hover:border-slate-350 hover:bg-slate-50 transition duration-150 cursor-pointer"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                      <CalendarDays size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t('Check Out', 'चेक-आउट')}</span>
                      <span className="text-sm font-semibold text-slate-800">{formatDisplayDate(checkOut)}</span>
                    </div>
                    <input
                      ref={checkOutRef}
                      type="date"
                      min={checkIn ? formatDate(new Date(new Date(checkIn).getTime() + 86400000)) : formatDate(tomorrow)}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full pointer-events-none"
                    />
                  </div>

                  {/* Adult */}
                  <div
                    onClick={handleAdultClick}
                    className="relative rounded-full border border-slate-200/80 bg-white px-5 py-3.5 flex items-center gap-3 shadow-sm hover:border-slate-350 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition duration-150 cursor-pointer"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                      <User size={18} />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t('Adult', 'वयस्क')}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          ref={adultRef}
                          type="number"
                          min="1"
                          max="20"
                          value={adults}
                          onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 text-sm font-semibold text-slate-800 bg-transparent border-none p-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-sm font-semibold text-slate-800 pointer-events-none">
                          {adults === 1 ? t('Adult', 'वयस्क') : t('Adults', 'वयस्क')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Children */}
                  <div
                    onClick={handleChildrenClick}
                    className="relative rounded-full border border-slate-200/80 bg-white px-5 py-3.5 flex items-center gap-3 shadow-sm hover:border-slate-350 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition duration-150 cursor-pointer"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                      <Baby size={18} />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t('Children', 'बच्चे')}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          ref={childrenRef}
                          type="number"
                          min="0"
                          max="20"
                          value={children}
                          onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 text-sm font-semibold text-slate-800 bg-transparent border-none p-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-sm font-semibold text-slate-800 pointer-events-none">
                          {children === 1 ? t('Child', 'बच्चा') : t('Children', 'बच्चे')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div
                    onClick={handleRoomsClick}
                    className="relative rounded-full border border-slate-200/80 bg-white px-5 py-3.5 flex items-center gap-3 shadow-sm hover:border-slate-350 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition duration-150 cursor-pointer col-span-1 sm:col-span-2 lg:col-span-1"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                      <Key size={18} />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t('Rooms', 'कमरे')}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          ref={roomsRef}
                          type="number"
                          min="1"
                          max="10"
                          value={roomsCount}
                          onChange={(e) => setRoomsCount(Math.max(1, Number(e.target.value)))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 text-sm font-semibold text-slate-800 bg-transparent border-none p-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-sm font-semibold text-slate-800 pointer-events-none">
                          {roomsCount === 1 ? t('Room', 'कमरा') : t('Rooms', 'कमरे')}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Check Availability button centered inside the card */}
                <div className="mt-6 flex justify-center w-full">
                  <button
                    onClick={handleBookingSubmit}
                    className="w-full sm:w-auto rounded-full bg-black px-8 sm:px-16 py-4 text-sm font-semibold text-white shadow-xl hover:bg-neutral-900 active:scale-95 transition-all duration-200 whitespace-nowrap z-30"
                  >
                    {t('Check Availability', 'खालीपन जांचें')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. ROOM SECTION - REDUCED PADDING */}
      <div className="max-w-[1400px] mx-auto px-4 pt-[320px] sm:pt-60 lg:pt-36 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-600">{t('Our Sanctuaries', 'हमारे अभयारण्य')}</p>
            <h2 className="text-4xl font-black text-[#0F4C4C] tracking-tight">{t('Curated Rooms', 'क्यूरेटेड कमरे')}</h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 max-w-full">
            {['All', ...categories.map(c => c.title)].map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-black uppercase text-[9px] tracking-widest transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#0F4C4C] text-white border-[#0F4C4C] shadow-md shadow-[#0F4C4C]/10'
                    : 'bg-white text-gray-800 border-gray-150 hover:bg-teal-50/50 hover:border-teal-150'
                }`}
              >
                {t(cat, cat)}
              </button>
            ))}
          </div>
        </div>

        {filteredRooms.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={filteredRooms.length > 1}
            slidesPerView={1.4}
            spaceBetween={16}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              }
            }}
            className="w-full pb-14"
          >
            {loading ? [1, 2, 3].map(i => (
              <SwiperSlide key={i} className="h-auto">
                <div className="w-full aspect-[4/5] bg-gray-100 rounded-[32px] animate-pulse h-full"></div>
              </SwiperSlide>
            )) :
              filteredRooms.map((room, i) => (
                <SwiperSlide key={room._id || i} className="h-auto">
                  <RoomCard
                    room={room}
                    index={i}
                    onBookClick={handleBookClick}
                    t={t}
                  />
                </SwiperSlide>
              ))
            }
          </Swiper>
        ) : !loading ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm max-w-full">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-[0.2em]">{t('No suites available in this category', 'इस श्रेणी में कोई कमरा उपलब्ध नहीं है')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-14">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full aspect-[4/5] bg-gray-100 rounded-[32px] animate-pulse h-full"></div>
            ))}
          </div>
        )}
      </div>

      {/* 2.5 COMBO OFFERS SECTION */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-600">{t('Exclusive Packages', 'विशेष पैकेज')}</p>
            <h2 className="text-4xl font-black text-[#0F4C4C] tracking-tight">{t('Combo Offers', 'कॉम्बो ऑफर')}</h2>
          </div>
          <Link to="/offers?tab=combos" className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F4C4C] border-b-2 border-[#0F4C4C] pb-1 hover:text-teal-600 hover:border-teal-600 transition-all">
            {t('View All Packages', 'सभी पैकेज देखें')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayComboOffers.map((combo, i) => (
            <ComboOfferCard
              key={combo._id || i}
              combo={combo}
              index={i}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* 2.7 EXCLUSIVE OFFERS SECTION */}
      {exclusiveOffers.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 py-8 pb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 md:mb-16 gap-6">
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-600">{t('Special Discounts', 'विशेष छूट')}</p>
              <h2 className="text-4xl font-black text-[#0F4C4C] tracking-tight">{t('Exclusive Offers', 'विशेष ऑफर')}</h2>
            </div>
            <Link to="/offers?tab=promos" className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F4C4C] border-b-2 border-[#0F4C4C] pb-1 hover:text-teal-600 hover:border-teal-600 transition-all">
              {t('View All Offers', 'सभी ऑफर देखें')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exclusiveOffers.slice(0, 3).map((offer, i) => (
              <motion.div
                key={offer._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-[40px] border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:border-teal-100 transition-all duration-300 p-8 flex flex-col justify-between relative overflow-hidden group h-[360px]"
              >
                <div className="absolute inset-y-0 right-0 w-24 opacity-[0.03] group-hover:opacity-10 group-hover:scale-125 transition-all duration-500 pointer-events-none">
                  <Zap size={140} className="text-[#0F4C4C] absolute top-10 right-4" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0F4C4C] group-hover:bg-[#0F4C4C] group-hover:text-white transition-colors duration-300 shadow-sm">
                      <Tag size={20} />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-[#0F4C4C] rounded-full text-[9px] font-black uppercase tracking-wider">
                      <Zap size={10} />
                      {t('Promo Deal', 'प्रोमो डील')}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-[#0F4C4C] mb-2 leading-tight tracking-tight group-hover:text-teal-800 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-3xl font-black text-teal-600 mb-4 tracking-tighter">
                    {offer.discount}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {offer.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 mt-4 flex flex-col gap-3">
                  {offer.code && (
                    <div className="flex items-center justify-between bg-[#F8FAFA] px-4 py-2.5 rounded-2xl border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-wider">{t('Promo Code', 'प्रोमो कोड')}</span>
                        <span className="text-xs font-black text-[#0F4C4C] tracking-widest">{offer.code}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(offer.code)}
                        className="text-[#0F4C4C] hover:text-teal-600 p-1.5 rounded-lg hover:bg-white transition-all cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedCode === offer.code ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => window.location.href = `/rooms?code=${offer.code}`}
                    className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 text-white rounded-full font-black uppercase text-[9px] tracking-widest transition-all duration-200 active:scale-[0.98] shadow-md cursor-pointer text-center"
                  >
                    {t('Book with Offer', 'ऑफर के साथ बुक करें')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}


      {/* PREMIUM MARQUEE - FULL WIDTH */}
      {/* <section className="luxury-marquee" aria-hidden="false">
        <div className="luxury-marquee__track" role="presentation">
          <div className="luxury-marquee__inner">
            {['Resort', 'Suites', 'Rooms', 'Hotels', 'Luxury', 'Comfort'].map((word, i) => (
              <span key={i} className="luxury-marquee__item">{word} <span className="luxury-marquee__sep">✷</span></span>
            ))}
          </div>
          <div className="luxury-marquee__inner" aria-hidden="true">
            {['Resort', 'Suites', 'Rooms', 'Hotels', 'Luxury', 'Comfort'].map((word, i) => (
              <span key={i} className="luxury-marquee__item">{word} <span className="luxury-marquee__sep">✷</span></span>
            ))}
          </div>
        </div>
      </section> */}

      {/* 3. FACILITIES SECTION - SIGNATURE EXPERIENCE */}
      <section id="facilities" className="bg-white py-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Column: Title, Description, and Vertical Image (Sticky on Desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-[#0F4C4C] tracking-tight leading-tight">
                  {t('Our Signature Experience', 'हमारा हस्ताक्षर अनुभव')}
                </h2>
                <p className="text-sm font-medium text-neutral-500 leading-relaxed max-w-md">
                  {t(
                    'We combine technology, trust, and personalized service to redefine the hotel booking experience. With transparent pricing, verified reviews, and exclusive deals.',
                    'हम होटल बुकिंग के अनुभव को फिर से परिभाषित करने के लिए प्रौद्योगिकी, विश्वास और व्यक्तिगत सेवा को जोड़ते हैं। पारदर्शी मूल्य निर्धारण, सत्यापित समीक्षाओं और विशेष सौदों के साथ।'
                  )}
                </p>
              </div>
              <div className="relative aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/5] rounded-[32px] overflow-hidden shadow-lg border border-neutral-100">
                <img
                  src={coupleImg}
                  alt="Our Signature Experience"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column: Facilities Grid in a Rounded Container with Particular Height Scroll */}
            <div className="lg:col-span-7">
              <div
                className="bg-neutral-50/50 border border-neutral-100 rounded-[40px] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] max-h-[600px] overflow-y-auto no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8 md:gap-x-12">
                  {/* Left sub-column */}
                  <div className="space-y-12 md:pr-8 md:border-r md:border-neutral-200/60">
                    {displayFacilities.filter((_, i) => i % 2 === 0).map((fac, i) => {
                      const IconMap = {
                        pool: Waves, waves: Waves, wind: Wind, coffee: Coffee,
                        utensils: Utensils, dining: Utensils, wifi: Wifi,
                        car: Car, transport: Car, camera: Camera, photography: Camera,
                        map: MapPin, location: MapPin, sparkles: Sparkles,
                        bed: Bed, room: Bed, restaurant: Utensils,
                        tour: MapPin, guide: MapPin, flag: Flag
                      };
                      const IconComponent = IconMap[fac.icon?.toLowerCase()] || Sparkles;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="flex flex-col space-y-4 group"
                        >
                          <div className="w-16 h-16 rounded-[24px] bg-white border border-neutral-200/60 shadow-sm flex items-center justify-center text-[#0F4C4C] group-hover:scale-105 transition-transform duration-300">
                            {fac.image ? (
                              <img src={getImageUrl(fac.image)} alt={fac.title} className="w-full h-full object-cover rounded-[24px]" />
                            ) : (
                              <IconComponent size={26} strokeWidth={1.5} />
                            )}
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xl font-bold text-neutral-800 tracking-tight">
                              {fac.title}
                            </h4>
                            <p className="text-sm font-medium text-neutral-500 leading-relaxed">
                              {fac.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Right sub-column */}
                  <div className="space-y-12 md:pl-4">
                    {displayFacilities.filter((_, i) => i % 2 !== 0).map((fac, i) => {
                      const IconMap = {
                        pool: Waves, waves: Waves, wind: Wind, coffee: Coffee,
                        utensils: Utensils, dining: Utensils, wifi: Wifi,
                        car: Car, transport: Car, camera: Camera, photography: Camera,
                        map: MapPin, location: MapPin, sparkles: Sparkles,
                        bed: Bed, room: Bed, restaurant: Utensils,
                        tour: MapPin, guide: MapPin, flag: Flag
                      };
                      const IconComponent = IconMap[fac.icon?.toLowerCase()] || Sparkles;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="flex flex-col space-y-4 group"
                        >
                          <div className="w-16 h-16 rounded-[24px] bg-white border border-neutral-200/60 shadow-sm flex items-center justify-center text-[#0F4C4C] group-hover:scale-105 transition-transform duration-300">
                            {fac.image ? (
                              <img src={getImageUrl(fac.image)} alt={fac.title} className="w-full h-full object-cover rounded-[24px]" />
                            ) : (
                              <IconComponent size={26} strokeWidth={1.5} />
                            )}
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xl font-bold text-neutral-800 tracking-tight">
                              {fac.title}
                            </h4>
                            <p className="text-sm font-medium text-neutral-500 leading-relaxed">
                              {fac.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. GALLERY SECTION */}
      <section className="py-16 bg-[#F8FAFA]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 md:mb-16">
            <h2 className="text-4xl font-black text-[#0F4C4C] tracking-tight">{t('The Visual Journal', 'दृश्य पत्रिका')}</h2>
            <Link to="/gallery" className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F4C4C] border-b-2 border-[#0F4C4C] pb-1 hover:text-teal-600 hover:border-teal-600 transition-all">
              {t('View All', 'सब देखें')}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {galleryItems.length > 0 ? galleryItems.map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className="aspect-square rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl relative group border border-white">
                <img src={getImageUrl(item.image)} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Sparkles className="text-white" size={24} />
                </div>
              </motion.div>
            )) : (
              [masterbedroom2Img, masterImg, maeterImg, familyImg, roomsImg, bathroomImg].map((img, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }} className="aspect-square rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl relative group border border-white">
                  <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Sparkles className="text-white" size={24} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              to="/gallery"
              className="px-10 py-4 bg-[#0F4C4C] hover:bg-[#2E7D7D] text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              {t('View More Gallery', 'अधिक गैलरी देखें')}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. VIDEO SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="relative overflow-hidden rounded-[36px] shadow-2xl h-[300px] md:h-[480px] bg-black group/video">
            <video
              ref={videoRef}
              src={heroVideo}
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

            {/* Custom Premium Controls Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">

              {/* Top Bar: Title / Info */}
              <div className="flex justify-between items-start">
                <span className="px-4 py-2 bg-black/40 backdrop-blur-md text-white/95 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-teal-400 animate-pulse" />
                  {t('Experience Luxury', 'लक्जरी का अनुभव करें')}
                </span>
              </div>

              {/* Center Play/Pause button for direct focus */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <button
                  onClick={handlePlayPause}
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white transition-all duration-300 hover:scale-110 hover:bg-white/25 active:scale-95 shadow-lg cursor-pointer"
                  aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                >
                  {isVideoPlaying ? (
                    <Pause size={32} className="fill-white text-white" />
                  ) : (
                    <Play size={32} className="fill-white text-white translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Bottom Bar: Action buttons */}
              <div className="flex justify-end gap-3 z-10">
                <button
                  onClick={handleMuteUnmute}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-white transition hover:scale-105 hover:bg-black/60 active:scale-95 cursor-pointer"
                  aria-label={isVideoMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isVideoMuted ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIAL SECTION */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl opacity-50"></div>
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 mb-20">
            <Quote size={40} className="text-teal-600 opacity-20" />
            <h2 className="text-4xl font-black text-[#0F4C4C] tracking-tight leading-tight">{t('Echoes of Excellence', 'उत्कृष्टता की प्रतिध्वनि')}</h2>
          </div>
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            slidesPerView={1.4}
            spaceBetween={16}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              }
            }}
            className="w-full"
          >
            {testimonials.length > 0 ? testimonials.map((test, i) => (
              <SwiperSlide key={i} className="h-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="p-8 sm:p-10 bg-[#F8FAFA] hover:bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-xl relative transition-all duration-300 group flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex gap-1 text-teal-600 mb-6">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                    </div>
                    <p className="text-sm font-medium text-[#0F4C4C] leading-relaxed mb-8 italic">"{test.content}"</p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-gray-100 pt-6 mt-2">
                    {test.image ? (
                      <img src={getImageUrl(test.image)} alt={test.name} className="w-12 h-12 rounded-full object-cover shadow-md border border-white" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-teal-50 border border-white flex items-center justify-center text-[#0F4C4C] font-bold text-sm">
                        {test.name?.[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-black text-xs uppercase tracking-widest text-[#0F4C4C]">{test.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{test.role}</p>
                    </div>
                  </div>
                  <div className="absolute top-8 right-8 text-gray-150 group-hover:text-teal-600/10 transition-colors pointer-events-none hidden sm:block">
                    <Quote size={40} className="transform rotate-180" />
                  </div>
                </motion.div>
              </SwiperSlide>
            )) : (
              [1, 2, 3].map(i => (
                <SwiperSlide key={i} className="h-auto">
                  <div className="h-64 bg-gray-50 rounded-[32px] animate-pulse h-full"></div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </section>

      {/* 5.5 PROMOTIONAL BANNER */}
      <section className="py-12 px-4">
        {banners.length > 0 ? (
          (() => {
            const activeBanner = banners.find(b => b.isActive) || banners[0];
            return (
              <div className="max-w-[1400px] mx-auto relative h-[400px] rounded-[48px] overflow-hidden shadow-2xl group">
                <img
                  src={activeBanner.image ? getImageUrl(activeBanner.image) : sitoutImg}
                  alt="Promotion"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C] via-[#0F4C4C]/60 to-transparent"></div>
                <div className="absolute inset-0 flex items-center px-12 md:px-20">
                  <div className="max-w-md space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Special Promotion</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter">
                      {activeBanner.title}
                    </h2>
                    <p className="text-white/80 text-sm font-medium leading-relaxed">
                      {activeBanner.subtitle}
                    </p>
                    <button
                      onClick={() => activeBanner.link && (window.location.href = activeBanner.link)}
                      className="px-8 py-4 bg-white text-[#0F4C4C] rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-teal-50 transition-all shadow-xl active:scale-95"
                    >
                      Explore Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="max-w-[1400px] mx-auto relative h-[400px] rounded-[48px] overflow-hidden shadow-2xl group">
            <img
              src={sitoutImg}
              alt="Promotion"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C] via-[#0F4C4C]/60 to-transparent"></div>
            <div className="absolute inset-0 flex items-center px-12 md:px-20">
              <div className="max-w-md space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">New Experience</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter">
                  Discover the Soul of <span className="text-teal-300">Kerala Backwaters</span>
                </h2>
                <p className="text-white/80 text-sm font-medium leading-relaxed">
                  Join our exclusive sunset cruises and traditional culinary workshops. Every moment at Lake Breeze is a story waiting to be told.
                </p>
                <button className="px-8 py-4 bg-white text-[#0F4C4C] rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-teal-50 transition-all shadow-xl active:scale-95">
                  Explore Activities
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5.8 LATEST NEWS / BLOG PREVIEW SECTION */}
      <section className="py-12 sm:py-16 bg-[#F8FAFA]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:mb-16 gap-4 sm:gap-6">
            <div className="space-y-2.5">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-600">{t('Stay Updated', 'अपडेटेड रहें')}</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F4C4C] tracking-tight">{t('Latest News', 'नवीनतम समाचार')}</h2>
            </div>
            <Link to="/blog" className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F4C4C] border-b-2 border-[#0F4C4C] pb-1 hover:text-teal-600 hover:border-teal-600 transition-all">
              {t('View All Posts', 'सभी पोस्ट देखें')}
            </Link>
          </div>

          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            slidesPerView={1.4}
            spaceBetween={16}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              }
            }}
            className="w-full"
          >
            {displayBlogs.map((post, i) => (
              <SwiperSlide key={post.slug || post.id} className="h-auto">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group flex flex-col justify-between h-full bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-gray-100/50 shadow-sm hover:shadow-xl transition-all duration-300 w-full"
                >
                  <div>
                    <Link to={`/blog/${post.slug || post.id}`}>
                      <div className="relative aspect-[16/10] rounded-[18px] sm:rounded-[24px] overflow-hidden mb-5 sm:mb-6 bg-gray-50">
                        <img
                          src={post.image ? getImageUrl(post.image) : masterbedroomImg}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400">
                        <span className="flex items-center gap-1.5"><User size={12} className="text-teal-600" /> By {post.author}</span>
                        <span className="flex items-center gap-1.5"><CalendarDays size={12} className="text-teal-600" /> {post.date}</span>
                      </div>
                      <Link to={`/blog/${post.slug || post.id}`}>
                        <h3 className="text-base sm:text-lg font-bold text-[#0F4C4C] leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {post.desc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-gray-50">
                    <Link
                      to={`/blog/${post.slug || post.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f4c4c] text-white hover:bg-neutral-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95 group/btn"
                    >
                      <span>{t('Read More', 'और पढ़ें')}</span>
                      <ArrowRight size={12} className="transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 6. CTA SECTION - MORE COMPACT */}
      <section className="py-16 px-4">
        <div className="max-w-[1400px] mx-auto bg-[#0F4C4C] rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-xl">
          {/* Background Image and Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1920&auto=format&fit=crop"
              alt="Reserve Paradise background"
              className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-transparent to-black/60"></div>
          </div>
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{t('Reserve Your Paradise', 'अपना स्वर्ग आरक्षित करें')}</h2>
            <p className="text-sm font-light text-teal-100 max-w-xl mx-auto opacity-80">{t('Direct bookings on WhatsApp enjoy priority upgrades and exclusive estate amenities.', 'सीधी बुकिंग पर प्राथमिकता अपग्रेड का आनंद लें।')}</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/rooms" className="px-10 py-5 bg-white text-[#0F4C4C] rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-xl hover:scale-105 transition-all">
                {t('View Suites', 'सुइट देखें')}
              </Link>
              <a href="https://wa.me/919876543210" className="px-10 py-5 bg-[#25D366] text-white rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                <Phone size={18} />
                {t('WhatsApp Us', 'व्हाट्सएप करें')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={selectedRoom}
      />
    </div>
  );
};

export default Home;
