import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomsRequest } from '../redux/slices/roomSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, MapPin, Waves, Users, Zap, Shield, Check, Phone, MessageCircle, Home as HomeIcon, Layout, CreditCard, Sparkles, Coffee, Utensils, Wifi, Wind, Car, Camera, Quote, CalendarDays, Bed, User, Baby, Key, ArrowRight, Flag, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Tag, Copy, Gift, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageHelper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import useSEO from '../hooks/useSEO';
import toast from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/navigation';
import heroVideo from '../assets/images/hero.mp4';
import bathroomImg from '../assets/images/bathroom.jpeg';
import mainVideo from '../assets/images/Main-video.mp4';
import coupleImg from '../assets/images/couple.jpeg';
import frontdesk from '../assets/images/frontdesk.png';
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
import ComboBookingModal from '../components/rooms/ComboBookingModal';
import logoLandscape from '../assets/LOGO LANDSCAPE.png';
import { AnimatePresence } from 'framer-motion';

const RoomCard = ({ room, index, onBookClick, onViewClick, t }) => {
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
    <div className="relative w-full aspect-[4/5] rounded-[28px] z-10" onClick={() => onViewClick(room)}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          backgroundColor: isHovered ? '#ffffff' : '#0b0f19',
          boxShadow: isHovered
            ? '0 30px 60px -15px rgba(15, 23, 42, 0.25)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.15)',
          border: isHovered ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.1)'
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 rounded-[28px] overflow-hidden cursor-pointer flex flex-col justify-start"
        style={{ transformOrigin: 'top center', willChange: 'background-color, box-shadow' }}
      >
        {/* Fixed Outer Image Container - occupies 100% in default, shrinks on hover */}
        <motion.div
          animate={{
            top: isHovered ? 12 : 0,
            left: isHovered ? 12 : 0,
            right: isHovered ? 12 : 0,
            bottom: isHovered ? '36%' : '0%',
            borderRadius: isHovered ? 20 : 28
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute overflow-hidden z-10 w-auto"
          style={{ transformOrigin: 'top center', willChange: 'top, left, right, bottom, border-radius' }}
        >
          <AnimatePresence>
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={room.name}
              initial={{ opacity: 0, scale: isHovered ? 1.08 : 1 }}
              animate={{
                opacity: 1,
                scale: isHovered ? 1.08 : 1
              }}
              exit={{ opacity: 0, scale: isHovered ? 1.08 : 1 }}
              transition={{
                opacity: { duration: 0.4 },
                scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Dark Gradient Overlay over image */}
          <motion.div
            animate={{ opacity: isHovered ? 0.2 : 0.85 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent pointer-events-none z-10"
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
                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${currentImageIndex === idx
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

        {/* Content Panel (Fixed position, non-animating content) - 32% height */}
        <div className="absolute bottom-0 left-0 right-0 h-[32%] px-4 pb-4 pt-1.5 z-20 flex flex-col justify-between">
          {/* Group texts and tags to prevent weird whitespace stretching */}
          <div className="flex flex-col gap-1.5">
            {/* Row 1: Title and Price Badge */}
            <div className="flex justify-between items-center gap-2">
              <motion.h3
                animate={{ color: isHovered ? '#0f172a' : '#ffffff' }}
                transition={{ duration: 0.5 }}
                className="text-xs sm:text-sm font-bold tracking-tight truncate leading-tight flex-1"
              >
                {room.name}
              </motion.h3>
              <motion.span
                animate={{
                  backgroundColor: isHovered ? '#0F4C4C' : '#ffffff',
                  color: isHovered ? '#ffffff' : '#0f172a'
                }}
                transition={{ duration: 0.5 }}
                className="shrink-0 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-tight shadow-sm"
              >
                ₹{room.price.toLocaleString()}
              </motion.span>
            </div>

            {/* Row 2: Short Description */}
            <motion.p
              animate={{ color: isHovered ? '#475569' : 'rgba(255, 255, 255, 0.8)' }}
              transition={{ duration: 0.5 }}
              className="text-[9px] sm:text-[10px] font-normal leading-relaxed line-clamp-1 overflow-hidden"
            >
              {room.description || t('Experience unparalleled luxury and serenity in our premium resort room designed for ultimate comfort.', 'അംതിമ് आराम के लिए डिज़ाइन किए गए हमारे premium റിസോർട്ട് മുറിയിൽ അതിവിശിഷ്ടമായ സൗകര്യം അനുഭവിക്കുക.')}
            </motion.p>

            {/* Row 3: Category tags (Facilities) - Always visible, smooth color transition */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-colors duration-350 ${isHovered
                ? 'bg-slate-100 border-slate-200/60 text-slate-600'
                : 'bg-white/10 border-white/10 text-white'
                }`}>
                {room.capacity || 2} Guests
              </span>
              <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-colors duration-350 ${isHovered
                ? 'bg-slate-100 border-slate-200/60 text-slate-600'
                : 'bg-white/10 border-white/10 text-white'
                }`}>
                Lake View
              </span>
              {room.quantity <= 3 && (
                <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-colors duration-350 ${isHovered
                  ? 'bg-red-50 border-red-100 text-red-600'
                  : 'bg-red-500/20 border-red-500/20 text-red-200'
                  }`}>
                  Only {room.quantity} left
                </span>
              )}
            </div>
          </div>

          {/* Row 4: Card Actions */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewClick(room);
              }}
              className="w-full sm:w-[130px] h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#C5A880] hover:border-[#C5A880] font-semibold uppercase text-[9px] tracking-widest hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
            >
              {t('View Details', 'विवरण देखें')}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookClick(room);
              }}
              className="w-full sm:w-[130px] h-10 rounded-full bg-white border border-[#0F4C4C]/40 text-[#0F4C4C] font-semibold uppercase text-[9px] tracking-widest hover:-translate-y-0.5 hover:shadow-md hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880] transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
            >
              {t('Book Now', 'अभी बुक करें')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const PricingComboCard = ({ combo, isFeatured, onBookClick, onViewClick, t }) => {
  const badgeText = combo.type && String(combo.type).trim() ? combo.type : t('Package', 'पैकेज');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: isFeatured ? 0.1 : 0.05 }}
      onClick={() => onViewClick(combo)}
      className={`bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group min-h-[560px] h-full border cursor-pointer ${isFeatured ? 'border-transparent' : 'border-neutral-200/60'}`}
    >
      {/* Active Border Overlay */}
      {isFeatured && (
        <div className="absolute inset-0 border-2 border-lime-400 rounded-[inherit] pointer-events-none z-30 shadow-[inset_0_0_12px_rgba(163,230,53,0.15)]" />
      )}
      <div>
        {/* Top Header Section (image box inside the card) */}
        <div className="relative h-[200px] rounded-[24px] md:rounded-[32px] overflow-hidden p-6 flex flex-col justify-between transition-colors duration-300">
          {/* Background Image / Logo Fallback */}
          {combo.coverImage ? (
            <img
              src={getImageUrl(combo.coverImage)}
              alt={combo.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-[#FAF6F0] flex items-center justify-center p-6 select-none">
              <img 
                src={logoLandscape} 
                alt="Lake Breeze Resort Logo" 
                className="h-10 w-auto object-contain opacity-60" 
              />
            </div>
          )}
          {/* Dark Overlay Gradient inside the image box */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 z-10" />

          {/* Badge */}
          <div className="relative z-20 self-start">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
              {badgeText}
            </span>
          </div>

          {/* Price */}
          <div className="relative z-20 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-md">
              ₹{combo.price.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-white/80">/{t('package', 'पैकेज')}</span>
          </div>
        </div>

        {/* Title and Short Description */}
        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-black text-[#0F4C4C] leading-snug group-hover:text-teal-800 transition-colors">
            {combo.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed font-normal">
            {combo.description}
          </p>
        </div>
      </div>

      <div>
        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewClick(combo);
            }}
            className="w-full sm:w-[130px] h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#C5A880] hover:border-[#C5A880] font-semibold uppercase text-[9px] tracking-widest hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
          >
            {t('View Details', 'विवरण देखें')}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookClick(combo);
            }}
            className="w-full sm:w-[130px] h-10 rounded-full bg-white border border-[#0F4C4C]/40 text-[#0F4C4C] font-semibold uppercase text-[9px] tracking-widest hover:-translate-y-0.5 hover:shadow-md hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880] transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
          >
            {t('Book Package', 'पैकेज बुक करें')}
          </button>
        </div>

        {/* Checklist */}
        {combo.includes && combo.includes.length > 0 && (
          <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3">
            {combo.includes.slice(0, 4).map((inc, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Check size={14} className="text-teal-600 shrink-0" />
                <span className="text-[11px] sm:text-xs text-neutral-600 font-semibold">{inc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ComboOfferCard = ({ combo, index, onBookClick, onViewClick, t }) => {
  const badgeText = combo.type && String(combo.type).trim() ? combo.type : t('Package', 'पैकेज');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onClick={() => onViewClick(combo)}
      className="relative w-full h-[360px] md:h-[420px] rounded-[32px] md:rounded-[48px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl border border-white/10 transition-all duration-500 group bg-slate-950 flex items-center"
    >
      {/* Background Cover Image / Logo Fallback */}
      {combo.coverImage ? (
        <img
          src={getImageUrl(combo.coverImage)}
          alt={combo.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[#FAF6F0] flex items-center justify-center p-12 select-none">
          <img 
            src={logoLandscape} 
            alt="Lake Breeze Resort Logo" 
            className="h-16 w-auto object-contain opacity-60" 
          />
        </div>
      )}

      {/* Responsive Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 md:bg-gradient-to-r md:from-slate-950 md:via-slate-950/70 md:to-transparent z-10" />

      {/* Content Overlay */}
      <div className="relative z-20 w-full h-full flex flex-col justify-end p-6 md:p-12 md:justify-center text-white">
        <div className="max-w-2xl space-y-4">
          {/* Package Type Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full self-start">
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white">
              {badgeText}
            </span>
          </div>

          {/* Title and Price */}
          <div className="space-y-2">
            <h3 className="text-white text-xl sm:text-2xl md:text-4xl font-black tracking-tight leading-tight group-hover:text-teal-300 transition-colors line-clamp-2">
              {combo.title}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-teal-400">
                ₹{combo.price.toLocaleString()}
              </span>
              <span className="text-white/30 text-xs">|</span>
              <span className="text-[8px] md:text-[9px] font-bold text-teal-200 uppercase tracking-widest bg-white/10 px-2 py-1 rounded">
                {t('All-Inclusive', 'सर्व समावेशी')}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[10px] sm:text-xs md:text-sm text-white/80 font-normal leading-relaxed line-clamp-2 md:line-clamp-3 max-w-xl">
            {combo.description}
          </p>

          {/* Included Items Tags */}
          {combo.includes && combo.includes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {combo.includes.slice(0, 4).map((inc, idx) => (
                <span key={idx} className="text-[7px] md:text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-white/10 border border-white/10 text-white/95">
                  {inc}
                </span>
              ))}
              {combo.includes.length > 4 && (
                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/5 text-white/50">
                  +{combo.includes.length - 4} More
                </span>
              )}
            </div>
          )}

          {/* Card Actions */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewClick(combo);
              }}
              className="w-full sm:w-[130px] h-10 rounded-full bg-white/10 border border-white/20 text-white hover:text-[#C5A880] font-semibold uppercase text-[9px] tracking-widest hover:-translate-y-0.5 hover:shadow-md hover:border-[#C5A880] transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
            >
              {t('View Details', 'विवरण देखें')}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookClick(combo);
              }}
              className="w-full sm:w-[130px] h-10 rounded-full bg-white border border-white text-[#0F4C4C] font-semibold uppercase text-[9px] tracking-widest hover:-translate-y-0.5 hover:shadow-md hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880] transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
            >
              {t('Book Package', 'पैकेज बुक करें')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PromotionalBannerCard = ({ banner, isHalfWidth, t }) => {
  return (
    <div className={`relative w-full overflow-hidden shadow-2xl group ${isHalfWidth
      ? 'h-[320px] md:h-[380px] rounded-[32px] md:rounded-[40px]'
      : 'h-[400px] rounded-[48px]'
      }`}>
      <img
        src={banner.image ? getImageUrl(banner.image) : sitoutImg}
        alt={banner.title || "Promotion"}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
      />
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 md:bg-gradient-to-r md:from-slate-950 md:via-slate-950/70 md:to-transparent z-10" />

      {/* Content Overlay */}
      <div className={`absolute inset-0 flex items-center z-20 ${isHalfWidth ? 'px-6 md:px-10' : 'px-12 md:px-20'
        }`}>
        <div className={`space-y-4 text-white ${isHalfWidth ? 'max-w-md' : 'max-w-xl md:max-w-2xl'
          }`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">
              {t('Special Promotion', 'विशेष प्रचार')}
            </span>
          </div>
          <h2 className={`font-black text-white leading-none tracking-tighter ${isHalfWidth ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'
            }`}>
            {banner.title}
          </h2>
          <p className="text-white/80 text-xs md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-3">
            {banner.subtitle}
          </p>
          <button
            onClick={() => banner.link && (window.location.href = banner.link)}
            className="px-6 py-3 md:px-8 md:py-4 bg-white text-[#0F4C4C] hover:bg-[#C5A880] hover:text-white rounded-full font-semibold uppercase text-[9px] tracking-widest transition-all duration-300 shadow-xl hover:-translate-y-[2px] active:translate-y-[1px] active:scale-95 cursor-pointer"
          >
            {t('Explore Now', 'अभी अन्वेषण करें')}
          </button>
        </div>
      </div>
    </div>
  );
};

const FacilityCard = ({ fac, index, t, onHeightChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconMap = {
    pool: Waves, waves: Waves, wind: Wind, coffee: Coffee,
    utensils: Utensils, dining: Utensils, wifi: Wifi,
    car: Car, transport: Car, camera: Camera, photography: Camera,
    map: MapPin, location: MapPin, sparkles: Sparkles,
    bed: Bed, room: Bed, restaurant: Utensils,
    tour: MapPin, guide: MapPin, flag: Flag
  };
  const IconComponent = IconMap[fac.icon?.toLowerCase()] || Sparkles;
  
  const descText = fac.description || fac.content || '';
  const needsTruncation = descText.length > 120;
  const displayText = isExpanded ? descText : (needsTruncation ? descText.slice(0, 115) + '...' : descText);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    if (onHeightChange) {
      setTimeout(onHeightChange, 100);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`bg-white border border-neutral-100/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between w-full h-auto ${isExpanded ? 'lg:min-h-[240px] lg:h-auto' : 'lg:h-[240px]'} hover:shadow-[0_12px_30px_rgba(15,76,76,0.04)] hover:border-teal-500/20 transition-all duration-300 hover:-translate-y-0.5 group`}
    >
      <div className="flex flex-col space-y-4">
        {/* Modern Premium Icon Box - Placed at Top */}
        <div className="w-14 h-14 rounded-2xl bg-[#0F4C4C]/5 text-[#0F4C4C] flex items-center justify-center group-hover:bg-[#0F4C4C] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
          {fac.image ? (
            <img src={getImageUrl(fac.image)} alt={fac.title} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <IconComponent size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
          )}
        </div>
        
        {/* Typography Hierarchy */}
        <div className="space-y-1.5 flex-1">
          <h4 className="text-lg font-bold text-neutral-800 tracking-tight leading-snug group-hover:text-teal-900 transition-colors">
            {fac.title}
          </h4>
          <p className="text-[13px] md:text-sm font-medium text-neutral-500 leading-relaxed transition-all duration-300">
            {displayText}
            {needsTruncation && (
              <button
                onClick={toggleExpand}
                className="text-[#0F4C4C] hover:text-teal-600 font-bold ml-1.5 focus:outline-none cursor-pointer underline text-[11px] uppercase tracking-wider inline-block"
              >
                {isExpanded ? t('Read Less', 'कम पढ़ें') : t('Read More', 'अधिक पढ़ें')}
              </button>
            )}
          </p>
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

  const [animationStep, setAnimationStep] = useState('landing');
  const isFirstLoad = false;

  useEffect(() => {
    document.body.classList.remove('loading-cinematic');
  }, []);

  const getContainerTransition = () => {
    const defaultEase = [0.22, 1, 0.36, 1];
    switch (animationStep) {
      case 'horizontal':
        return {
          layout: { duration: 0.4, ease: defaultEase },
          opacity: { duration: 0.2 }
        };
      case 'reveal':
        return {
          layout: { duration: 0.6, ease: defaultEase },
          borderRadius: { duration: 0.6, ease: defaultEase },
          opacity: { duration: 0.3 }
        };
      case 'zoomOut':
      case 'settled':
        return {
          layout: { duration: 0.7, ease: defaultEase },
          borderRadius: { duration: 0.7, ease: defaultEase },
          opacity: { duration: 0.4 }
        };
      default:
        return {
          layout: { duration: 0.8, ease: defaultEase },
          opacity: { duration: 0.5 }
        };
    }
  };

  const getContainerStyles = () => {
    const isMobile = window.innerWidth < 768;
    if (animationStep === 'landing') {
      return {
        position: 'relative',
        width: '100%',
        minHeight: isMobile ? '42vh' : '92vh',
        zIndex: 0,
        borderRadius: isMobile ? '24px' : '48px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      };
    }

    switch (animationStep) {
      case 'initial':
      case 'vertical':
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          width: '2px',
          height: '0px',
          opacity: 0,
          zIndex: 100,
        };
      case 'horizontal':
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          width: '100vw',
          height: '2px',
          opacity: 1,
          borderRadius: '0px',
          border: 'none',
          boxShadow: 'none',
          zIndex: 100,
        };
      case 'reveal':
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          width: isMobile ? '85vw' : '60vw',
          height: isMobile ? '50vh' : '60vh',
          opacity: 1,
          borderRadius: '24px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 0 50px rgba(212, 175, 55, 0.2), inset 0 0 30px rgba(212, 175, 55, 0.1)',
          zIndex: 100,
          backgroundColor: '#000000',
        };
      case 'zoomOut':
      case 'settled':
        return {
          position: 'fixed',
          top: isMobile ? '12px' : '24px',
          left: '50%',
          x: '-50%',
          y: '0%',
          width: isMobile ? 'calc(100vw - 1.5rem)' : 'calc(100vw - 4rem)',
          height: isMobile ? '42vh' : '92vh',
          opacity: 1,
          borderRadius: isMobile ? '24px' : '48px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 100,
        };
      default:
        return {};
    }
  };

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [comboOffers, setComboOffers] = useState([]);
  const [selectedComboCategory, setSelectedComboCategory] = useState('All');

  const comboCategories = useMemo(() => {
    const types = comboOffers
      .map(combo => combo.type)
      .filter(type => typeof type === 'string' && type.trim() !== '');
    return ['All', ...Array.from(new Set(types))];
  }, [comboOffers]);

  const displayComboOffers = useMemo(() => {
    if (selectedComboCategory === 'All') return comboOffers;
    return comboOffers.filter(combo => combo.type === selectedComboCategory);
  }, [comboOffers, selectedComboCategory]);

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
      title: t('Infinity Pool', 'इन्फिनिटी पूल'),
      description: t('Dive into luxury with our stunning infinity pool, offering breathtaking views of the backwaters.', 'हमारे शानदार इन्फिनिटी पूल के साथ विलासिता में गोता लगाएँ, जो बैकवाटर्स के लुभावने दृश्य प्रस्तुत करता है।'),
      icon: 'pool'
    },
    {
      title: t('Lakeside Dining', 'लेकसाइड डाइनिंग'),
      description: t('Savor authentic Kerala cuisine and international dishes prepared by signature chefs at our lakefront restaurant.', 'हमारे लेकफ्रंट रेस्तरां में सिग्नेचर शेफ द्वारा तैयार प्रामाणिक केरल व्यंजन और अंतर्राष्ट्रीय व्यंजनों का स्वाद लें।'),
      icon: 'utensils'
    },
    {
      title: t('Ayurvedic Spa', 'आयुर्वेदिक स्पा'),
      description: t('Rejuvenate your body and soul with traditional Ayurvedic treatments and therapies from certified experts.', 'प्रमाणित विशेषज्ञों से पारंपरिक आयुर्वेदिक उपचार और थेरेपी के साथ अपने शरीर और आत्मा को तरोताजा करें।'),
      icon: 'sparkles'
    },
    {
      title: t('High-Speed WiFi', 'हाई-स्पीड वाईफाई'),
      description: t('Stay seamlessly connected with complimentary high-speed internet access throughout the resort premises.', 'पूरे रिसॉर्ट परिसर में मानार्थ हाई-स्पीड इंटरनेट एक्सेस के साथ निर्बाध रूप से जुड़े रहें।'),
      icon: 'wifi'
    },
    {
      title: t('Travel Desk', 'यात्रा डेस्क'),
      description: t('Explore Kumarakom with our curated local sightseeing tours, houseboat cruises, and transport arrangements.', 'हमारे क्यूरेटेड स्थानीय दर्शनीय स्थलों की यात्रा, हाउसबोट परिभ्रमण और परिवहन व्यवस्था के साथ कुमारकोम का अन्वेषण करें।'),
      icon: 'car'
    },
    {
      title: t('Photography Spot', 'फोटोग्राफी स्पॉट'),
      description: t('Capture your unforgettable moments against the picturesque backdrop of our resort gardens and water canals.', 'हमारे रिसॉर्ट के बगीचों और पानी की नहरों की सुरम्य पृष्ठभूमि के साथ अपने अविस्मरणीय क्षणों को कैमरे में कैद करें।'),
      icon: 'camera'
    }
  ];
  const displayFacilities = [...facilities];
  if (displayFacilities.length < 6) {
    for (const def of defaultFacilities) {
      if (displayFacilities.length >= 6) break;
      const isDuplicate = displayFacilities.some(f => {
        const fTitle = (typeof f.title === 'string' ? f.title : (f.title?.en || f.title?.hi || '')).trim().toLowerCase();
        const defTitle = (typeof def.title === 'string' ? def.title : (def.title?.en || def.title?.hi || '')).trim().toLowerCase();
        return fTitle === defTitle || fTitle.includes(defTitle) || defTitle.includes(fTitle);
      });
      if (!isDuplicate) {
        displayFacilities.push(def);
      }
    }
  }
  const visibleFacilities = displayFacilities;
  const [testimonials, setTestimonials] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [banners, setBanners] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  const displayBlogs = blogs.map(blog => ({
    id: blog._id,
    slug: blog.slug || blog._id,
    image: blog.image,
    author: blog.author || 'Admin',
    date: new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    title: blog.title,
    desc: blog.content
  })).slice(0, 3);

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

  const scrollContainerRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const isDesktop = window.innerWidth >= 1024;
    const isScrollable = container.scrollHeight > container.clientHeight;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 15;
    setShowArrow(isDesktop && isScrollable && !isAtBottom);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      handleScroll();
      const resizeObserver = new ResizeObserver(() => {
        handleScroll();
      });
      resizeObserver.observe(container);
      const gridEl = container.firstElementChild;
      if (gridEl) {
        resizeObserver.observe(gridEl);
      }
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      const timer = setTimeout(handleScroll, 500);
      return () => {
        resizeObserver.disconnect();
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
        clearTimeout(timer);
      };
    }
  }, [visibleFacilities]);


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
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);

  const handleBookClick = (room) => {
    const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
    navigate(`/rooms/${slugify(room.name)}`);
  };

  const handleComboBookClick = (combo) => {
    const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
    navigate(`/packages/${slugify(combo.title)}`);
  };

  const handleViewClick = (room) => {
    const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
    navigate(`/rooms/${slugify(room.name)}`);
  };

  const handleComboViewClick = (combo) => {
    const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
    navigate(`/packages/${slugify(combo.title)}`);
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
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  const handleBookingSubmit = () => {
    navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}&rooms=${roomsCount}`);
  };

  return (
    <div className="bg-[#F8FAFA] min-h-screen">
      {/* 1. HERO SECTION */}
      <section 
        className="px-4 py-4 md:px-8 md:py-6 bg-white relative overflow-visible"
        style={{ minHeight: window.innerWidth < 768 ? 'auto' : 'calc(92vh + 48px)' }}
      >
            {/* Cinematic Black Background Overlay */}
            <AnimatePresence>
              {isFirstLoad && animationStep !== 'landing' && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: (animationStep === 'zoomOut' || animationStep === 'settled') ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className={`fixed inset-0 bg-black z-[98] ${(animationStep === 'zoomOut' || animationStep === 'settled') ? 'pointer-events-none' : 'pointer-events-auto'}`}
                />
              )}
            </AnimatePresence>

            {/* Step 2: Energy Line Vertical */}
            {isFirstLoad && (animationStep === 'vertical' || animationStep === 'horizontal') && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="energy-line-vertical h-[100vh]"
                style={{ originY: 1 }}
              />
            )}

            {/* Step 3: Horizontal Expansion */}
            {isFirstLoad && animationStep === 'horizontal' && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="energy-line-horizontal w-[100vw]"
                style={{ originX: 0.5 }}
              />
            )}

            {/* Hero Section Container */}
            <motion.div
              layout
              style={{
                ...getContainerStyles(),
                overflow: (animationStep === 'settled' || animationStep === 'landing') ? 'visible' : 'hidden'
              }}
              transition={{
                layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                borderRadius: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.5 }
              }}
              className="relative min-h-[42vh] md:min-h-[92vh] bg-gradient-to-b from-[#A5C5E8] to-[#FFFFFF] shadow-md flex flex-col justify-center md:justify-between p-6 sm:p-8 md:p-12 lg:p-16 pb-6 md:pb-36 z-10"
            >

              {/* Clip container for background image and overlays */}
              <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none rounded-[inherit]">
                <motion.video
                  src={mainVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  animate={{
                    scale: (animationStep === 'frame' || animationStep === 'reveal') ? 1.6 : 1.0,
                    opacity: (animationStep === 'initial' || animationStep === 'vertical' || animationStep === 'horizontal' || animationStep === 'frame') ? 0 : 1
                  }}
                  transition={{
                    scale: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.8, ease: "easeInOut" }
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-bottom mix-blend-normal z-0"
                />
                {/* Subtle gradient overlay to protect text readability */}
                <motion.div
                  animate={{ opacity: (animationStep === 'settled' || animationStep === 'landing') ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#A5C5E8]/60 to-transparent pointer-events-none z-10"
                />
                <motion.div
                  animate={{ opacity: (animationStep === 'settled' || animationStep === 'landing') ? 0.05 : 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-black pointer-events-none z-10"
                />
              </div>

              {/* Text Container */}
              <div className="relative z-10 w-full pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 w-full">
                  <div className="lg:col-span-8 overflow-hidden">
                    <motion.h1
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{
                        y: (animationStep === 'settled' || animationStep === 'landing') ? "0%" : "100%",
                        opacity: (animationStep === 'settled' || animationStep === 'landing') ? 1 : 0
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                      className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-[7.2rem] font-semibold tracking-tight leading-none"
                    >
                      {t('Stay with comfort', 'आराम के साथ रहें')}
                    </motion.h1>
                  </div>
                  <div className="lg:col-span-4 lg:self-end lg:pt-12 overflow-hidden">
                    <motion.p
                      initial={{ y: 30, opacity: 0 }}
                      animate={{
                        y: (animationStep === 'settled' || animationStep === 'landing') ? 0 : 30,
                        opacity: (animationStep === 'settled' || animationStep === 'landing') ? 1 : 0
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                      className="text-white text-xs sm:text-sm leading-relaxed max-w-sm lg:ml-auto mt-2 lg:mt-0"
                    >
                      {t(
                        'Welcome — where comfort meets elegance and every guest feels at home. Our doors are always open to warmth, comfort, and unforgettable memories.',
                        'स्वागत है - जहां आराम लालित्य से मिलता है और हर अतिथि घर जैसा महसूस करता है। हमारे दरवाजे गर्मी, आराम और अविस्मरणीय यादों के लिए हमेशा खुले हैं।'
                      )}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search/Booking Widget Wrapper - responsive layout (relative/in-flow on mobile, absolute/overlay on desktop) */}
            <div className="relative md:absolute md:bottom-0 md:left-1/2 md:-translate-x-1/2 md:translate-y-1/2 z-20 w-full md:w-[calc(100%-4rem)] max-w-[1080px] px-0 md:px-4 mt-6 md:mt-0">
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{
                    y: (animationStep === 'settled' || animationStep === 'landing') ? 0 : 80,
                    opacity: (animationStep === 'settled' || animationStep === 'landing') ? 1 : 0
                  }}
                  transition={{
                    delay: (animationStep === 'landing') ? 0 : 0.5,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1]
                  }}
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
                              {children === 1 ? t('Child', 'बच्चാ') : t('Children', 'बच्चे')}
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
                        className="btn-book-now w-full sm:w-auto px-8 sm:px-16 py-4 text-sm z-30 cursor-pointer"
                      >
                        {t('Check Availability', 'खालीपन जांचें')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
          </section>

          {/* 2. ROOM SECTION - REDUCED PADDING */}
          <div className="max-w-[1400px] mx-auto px-4 pt-12 md:pt-36 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
              <div className="space-y-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-teal-600">{t('Our Sanctuaries', 'हमारे अभयारण्य')}</p>
                <h2 className="text-4xl font-semibold text-[#0F4C4C] tracking-tight">{t('Curated Rooms', 'क्यूरेटेड कमरे')}</h2>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 max-w-full">
                {['All', ...categories.map(c => c.title)].map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full font-black uppercase text-[9px] tracking-widest transition-all duration-300 whitespace-nowrap cursor-pointer border ${selectedCategory === cat
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
                loop={!loading && filteredRooms.length > 3}
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
                        onViewClick={handleViewClick}
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

          {/* 2.5 PROMOTIONAL BANNERS */ }
          <div className="max-w-[1400px] mx-auto px-4 py-8 pb-16">
            {(() => {
              const activeBanners = banners.filter(b => b.isActive);
              const mockBanner = {
                title: t('Discover the Soul of Kerala Backwaters', 'केरल बैकवाटर की आत्मा की खोज करें'),
                subtitle: t('Join our exclusive sunset cruises and traditional culinary workshops. Every moment at Lake Breeze is a story waiting to be told.', 'हमारे विशेष सूर्यास्त परिभ्रमण और पारंपरिक पाक कार्यशालाओं में शामिल हों। लेक ब्रीज पर हर पल एक कहानी है जो बताए जाने की प्रतीक्षा कर रही है।'),
                image: null,
                link: '#',
                isActive: true
              };
              const displayBanners = activeBanners.length > 0
                ? activeBanners
                : (banners.length > 0 ? [banners[0]] : [mockBanner]);

              return displayBanners.length === 1 ? (
                <PromotionalBannerCard
                  banner={displayBanners[0]}
                  isHalfWidth={false}
                  t={t}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {displayBanners.map((banner, i) => (
                    <PromotionalBannerCard
                      key={banner._id || i}
                      banner={banner}
                      isHalfWidth={true}
                      t={t}
                    />
                  ))}
                </div>
              );
            })()}
          </div>

          {/* 2.7 EXCLUSIVE OFFERS SECTION */ }
          {
            exclusiveOffers.length > 0 && (
              <div className="max-w-[1400px] mx-auto px-4 py-8 pb-16">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 md:mb-16 gap-6">
                  <div className="space-y-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-teal-600">{t('Special Discounts', 'विशेष छूट')}</p>
                    <h2 className="text-4xl font-semibold text-[#0F4C4C] tracking-tight">{t('Exclusive Offers', 'विशेष ऑफर')}</h2>
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
                          className="btn-book-now w-full py-3 text-[9px] cursor-pointer"
                        >
                          {t('Book with Offer', 'ऑफर के साथ बुक करें')}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          }


          {/* PREMIUM MARQUEE - FULL WIDTH */ }
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

          {/* 3. FACILITIES SECTION - SIGNATURE EXPERIENCE */ }
          <section id="facilities" className="bg-white py-20 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
              
              {/* Header: Title, Description, and View All Link */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-16 gap-6">
                <div className="space-y-3 max-w-2xl">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-teal-600">
                    {t('Exclusive Amenities', 'विशेष सुविधाएं')}
                  </p>
                  <h2 className="text-4xl lg:text-5xl font-semibold text-[#0F4C4C] tracking-tight leading-tight">
                    {t('Our Signature Experience', 'हमारा हस्ताक्षर अनुभव')}
                  </h2>
                  <p className="text-sm font-normal text-neutral-500 leading-relaxed mt-2">
                    {t(
                      'We combine technology, trust, and personalized service to redefine the hotel booking experience. With transparent pricing, verified reviews, and exclusive deals.',
                      'हम होटल बुकिंग के अनुभव को फिर से परिभाषित करने के लिए प्रौद्योगिकी, विश्वास और व्यक्तिगत सेवा को जोड़ते हैं। पारदर्शी मूल्य निर्धारण, सत्यापित समीक्षाओं और विशेष सौदों के साथ।'
                    )}
                  </p>
                </div>
                <div className="shrink-0 pb-1">
                  <Link to="/facilities" className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F4C4C] border-b-2 border-[#0F4C4C] pb-1 hover:text-teal-600 hover:border-teal-600 transition-all w-fit inline-block">
                    {t('View All Facilities', 'सभी सुविधाएं देखें')}
                  </Link>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch w-full relative">

                {/* Left Column: Vertical Image (Aspect ratio determines layout height on desktop/mobile) */}
                <div className="w-full lg:w-[35%] aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/5] shrink-0">
                  <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-lg border border-neutral-100">
                    <img
                      src={frontdesk}
                      alt="Our Signature Experience"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right Column: Facilities Grid (Height matched to image, scrollable if overflow) */}
                <div className="w-full lg:w-[65%] shrink-0 lg:flex lg:flex-col">
                  <div className="relative w-full lg:flex-1 lg:h-0 lg:min-h-full">
                    {/* Top fade gradient overlay - only on desktop */}
                    <div className="hidden lg:block absolute top-1.5 left-1.5 right-1.5 h-16 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-10 rounded-t-[38px]" />

                    {/* Scrollable container with height matched to left column on desktop, auto-height on mobile */}
                    <div
                      ref={scrollContainerRef}
                      onScroll={handleScroll}
                      className="bg-neutral-50/40 border border-neutral-100/70 rounded-[40px] p-6 sm:p-8 md:p-10 transition-all duration-300 w-full h-auto overflow-visible lg:absolute lg:inset-0 lg:overflow-y-auto no-scrollbar scroll-smooth"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch w-full">
                        {visibleFacilities.map((fac, i) => (
                          <FacilityCard key={i} fac={fac} index={i} t={t} onHeightChange={handleScroll} />
                        ))}
                      </div>
                    </div>

                    {/* Bottom fade gradient overlay - only on desktop */}
                    <div className="hidden lg:block absolute bottom-1.5 left-1.5 right-1.5 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10 rounded-b-[38px]" />

                    {/* Bouncing down indicator arrow */}
                    {showArrow && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center animate-fade">
                        <div className="bg-white/95 backdrop-blur-sm border border-neutral-100 shadow-md rounded-full p-2.5 flex items-center justify-center text-[#0F4C4C] animate-bounce">
                          <ChevronDown size={18} className="stroke-[2.5]" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 3.5 COMBO OFFERS SECTION (PRICING CARD STYLE) */ }
          <section className="py-24 bg-[#F8FAFA] border-t border-b border-neutral-200/50">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
                <div className="space-y-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-teal-600">{t('Exclusive Packages', 'विशेष पैकेज')}</p>
                  <h2 className="text-4xl font-semibold text-[#0F4C4C] tracking-tight">{t('Combo Offers', 'कॉम्बो ऑफर')}</h2>
                </div>
                <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end">
                  <Link to="/offers?tab=combos" className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F4C4C] border-b-2 border-[#0F4C4C] pb-1 hover:text-teal-600 hover:border-teal-600 transition-all">
                    {t('View All Packages', 'सभी पैकेज देखें')}
                  </Link>
                  {/* Custom Swiper Controls */}
                  <div className="flex items-center gap-3">
                    <button className="combo-prev-btn p-2.5 bg-white hover:bg-[#0F4C4C] hover:text-white text-[#0F4C4C] border border-[#0F4C4C]/10 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="combo-next-btn p-2.5 bg-white hover:bg-[#0F4C4C] hover:text-white text-[#0F4C4C] border border-[#0F4C4C]/10 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Filter Tabs */}
              {comboCategories.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-6 pt-2 no-scrollbar -mx-6 px-6 sm:-mx-0 sm:px-0 sm:flex-wrap mb-8">
                  {comboCategories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedComboCategory(cat)}
                      className={`px-5 py-2.5 rounded-full font-black uppercase text-[9px] tracking-widest transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                        selectedComboCategory === cat
                          ? 'bg-[#0F4C4C] text-white border-[#0F4C4C] shadow-md shadow-[#0F4C4C]/10'
                          : 'bg-white text-gray-800 border-gray-150 hover:bg-teal-50/50 hover:border-teal-150'
                      }`}
                    >
                      {cat === 'All' ? t('All Experiences', 'सभी अनुभव') : t(cat, cat)}
                    </button>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedComboCategory}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  {displayComboOffers.length > 0 ? (
                    <Swiper
                      modules={[Autoplay, Navigation]}
                      autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      navigation={{
                        prevEl: '.combo-prev-btn',
                        nextEl: '.combo-next-btn',
                      }}
                      loop={displayComboOffers.length > 3}
                      slidesPerView={1.2}
                      spaceBetween={16}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 24,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 32,
                        }
                      }}
                      className="w-full pt-6 pb-12 px-2 -mx-2 combo-offers-swiper"
                    >
                      {displayComboOffers.map((combo, i) => (
                        <SwiperSlide key={combo._id || i} className="h-auto">
                          <PricingComboCard
                            combo={combo}
                            isFeatured={i % 3 === 1} // Highlights the middle card in groups of 3
                            onBookClick={handleComboBookClick}
                            onViewClick={handleComboViewClick}
                            t={t}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-[40px] border border-gray-100 shadow-sm max-w-full">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-[0.2em]">
                        {t('No combo offers available currently', 'वर्तमान में कोई कॉम्बो ऑफर उपलब्ध नहीं है')}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* 4. GALLERY SECTION */ }
          <section className="py-16 bg-white">
            <div className="max-w-[1400px] mx-auto px-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 md:mb-16">
                <h2 className="text-4xl font-semibold text-[#0F4C4C] tracking-tight">{t('The Visual Journal', 'दृश्य पत्रिका')}</h2>
                <Link to="/gallery" className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F4C4C] border-b-2 border-[#0F4C4C] pb-1 hover:text-teal-600 hover:border-teal-600 transition-all">
                  {t('View All', 'सब देखें')}
                </Link>
              </div>
              {galleryItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                  {galleryItems.map((item, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.02 }} className="aspect-square rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl relative group border border-white">
                      <img src={getImageUrl(item.image)} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Sparkles className="text-white" size={24} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-neutral-50 rounded-[40px] border border-gray-100 shadow-sm max-w-full">
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-[0.2em]">
                    {t('No gallery images available', 'कोई गैलरी चित्र उपलब्ध नहीं हैं')}
                  </p>
                </div>
              )}
              <div className="mt-12 flex justify-center">
                <Link
                  to="/gallery"
                  className="btn-book-now px-10 py-4 text-[10px] flex items-center gap-2 cursor-pointer"
                >
                  {t('View More Gallery', 'अधिक गैलरी देखें')}
                </Link>
              </div>
            </div>
          </section>

          {/* 5. VIDEO SECTION */ }
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

          {/* 5. TESTIMONIAL SECTION */ }
          <section className="py-16 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl opacity-50"></div>
            <div className="max-w-[1400px] mx-auto px-4 relative z-10">
              <div className="flex flex-col items-center text-center space-y-8 mb-20">
                <Quote size={40} className="text-teal-600 opacity-20" />
                <h2 className="text-4xl font-semibold text-[#0F4C4C] tracking-tight leading-tight">{t('Echoes of Excellence', 'उत्कृष्टता की प्रतिध्वनि')}</h2>
              </div>
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={testimonials.length > 3}
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


          {/* 5.8 LATEST NEWS / BLOG PREVIEW SECTION */ }
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

              {displayBlogs.length > 0 ? (
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  loop={displayBlogs.length > 3}
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
              ) : (
                <div className="text-center py-12 bg-white rounded-[40px] border border-gray-100 shadow-sm max-w-full">
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-[0.2em]">
                    {t('No news posts available', 'कोई समाचार पोस्ट उपलब्ध नहीं हैं')}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* 6. CTA SECTION - MORE COMPACT */ }
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

      <ComboBookingModal
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        combo={selectedCombo}
      />
    </div >
  );
};

export default Home;
