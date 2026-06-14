import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Users, Sparkles, ShieldCheck, Heart, Coffee, Wifi, Check, Trash2, BedDouble, Calendar, User, Mail, Phone, CheckCircle, ChevronRight, BookmarkCheck } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageHelper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RoomDetailsModal = ({ isOpen, onClose, room, onBookNow }) => {
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(null);
    const [formData, setFormData] = useState({
        guestName: '',
        email: '',
        phone: '',
        checkIn: null,
        checkOut: null,
        adults: 1,
        children: 0,
        specialRequests: ''
    });

    const [totalPrice, setTotalPrice] = useState(0);

    // Reset state on open/change
    useEffect(() => {
        setActiveIndex(0);
        setStep(1);
        setIsSubmitting(false);
        setBookingSuccess(null);
        setFormData({
            guestName: '',
            email: '',
            phone: '',
            checkIn: null,
            checkOut: null,
            adults: 1,
            children: 0,
            specialRequests: ''
        });
        setTotalPrice(0);
    }, [room, isOpen]);

    // Calculate total price
    useEffect(() => {
        if (formData.checkIn && formData.checkOut && room) {
            const start = new Date(formData.checkIn);
            const end = new Date(formData.checkOut);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            if (days > 0) {
                setTotalPrice(days * room.price);
            } else {
                setTotalPrice(0);
            }
        }
    }, [formData.checkIn, formData.checkOut, room?.price]);

    if (!room) return null;

    const isAvailable = room.quantity > 0 && room.isAvailable !== false;

    // Helper to map basic amenity names to icons
    const renderAmenityIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('wifi') || lowerName.includes('internet')) {
            return <Wifi size={14} className="text-[#2E7D7D]" />;
        }
        if (lowerName.includes('coffee') || lowerName.includes('tea') || lowerName.includes('breakfast')) {
            return <Coffee size={14} className="text-[#2E7D7D]" />;
        }
        return <Check size={14} className="text-[#2E7D7D]" />;
    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === 'guestName') {
            value = value.replace(/\b\w/g, char => char.toUpperCase());
        } else if (name === 'specialRequests') {
            if (value.length > 0) {
                value = value.charAt(0).toUpperCase() + value.slice(1);
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            if (!formData.checkIn || !formData.checkOut) {
                return toast.error(t('Please select dates', 'कृपया तिथियां चुनें'));
            }
            return setStep(2);
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    room: room._id,
                    totalPrice
                })
            });

            const data = await response.json();
            if (response.ok) {
                setBookingSuccess(data);
            } else {
                toast.error(data.message || t('Booking failed', 'बुकिंग विफल रही'));
            }
        } catch (err) {
            toast.error(t('Network error', 'नेटवर्क त्रुटि'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0F4C4C]/35 backdrop-blur-md" 
                        onClick={onClose}
                    ></motion.div>
                    
                    {/* Modal Content Card */}
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(15,76,76,0.3)] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh] lg:h-[85vh] border border-white"
                    >
                        {/* Close Button */}
                        <button 
                            onClick={onClose} 
                            className="absolute top-6 right-6 z-30 p-2.5 bg-white/90 hover:bg-white text-primary rounded-full transition-all active:scale-90 shadow-md border border-gray-100 cursor-pointer"
                        >
                            <X size={20} className="text-[#0F4C4C]" />
                        </button>

                        {/* Left Column: Image Gallery & Room Details */}
                        <div className="w-full md:w-[48%] bg-[#F8FAFA] border-b md:border-b-0 md:border-r border-gray-100 flex flex-col md:h-full md:overflow-y-auto no-scrollbar shrink-0">
                            {room.images && room.images.length > 0 ? (
                                <div className="flex flex-col w-full shrink-0">
                                    {/* Big Main Image Section */}
                                    <div className="relative w-full h-[280px] md:h-[360px] overflow-hidden select-none bg-black shrink-0">
                                        <AnimatePresence mode="wait">
                                            <motion.img 
                                                key={activeIndex}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                src={getImageUrl(room.images[activeIndex]?.url || room.images[activeIndex])} 
                                                alt={`${room.name} active view`} 
                                                className="w-full h-full object-cover absolute inset-0"
                                            />
                                        </AnimatePresence>
                                        
                                        {/* Gradient Overlay for image */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                        
                                        {/* Image Category Badge */}
                                        {room.images[activeIndex]?.category && (
                                            <span className="absolute bottom-6 left-6 px-3.5 py-1.5 bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                                                {room.images[activeIndex].category}
                                            </span>
                                        )}

                                        {/* Floating details overlay on image panel (Desktop only) */}
                                        <div className="absolute bottom-6 right-6 z-20 pointer-events-none hidden lg:block">
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[8px] font-black text-[#0F4C4C] rounded-xl uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                                                    <Sparkles size={10} className="text-[#2E7D7D]" />
                                                    {t('Premium Resort', 'प्रीमियम रिसॉर्ट')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Small Sliding Thumbnails Section */}
                                    {room.images.length > 1 && (
                                        <div className="p-4 bg-white border-t border-gray-100 w-full shrink-0">
                                            <Swiper
                                                modules={[Navigation]}
                                                navigation
                                                spaceBetween={10}
                                                slidesPerView={4}
                                                className="w-full select-none"
                                            >
                                                {room.images.map((image, index) => {
                                                    const imgUrl = getImageUrl(image?.url || image);
                                                    const isActive = index === activeIndex;
                                                    return (
                                                        <SwiperSlide key={index}>
                                                            <button 
                                                                onClick={() => setActiveIndex(index)}
                                                                className={`w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all relative block cursor-pointer ${
                                                                    isActive 
                                                                        ? 'border-[#0F4C4C] scale-[0.98]' 
                                                                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]'
                                                                }`}
                                                            >
                                                                <img 
                                                                    src={imgUrl} 
                                                                    alt={`${room.name} thumbnail ${index + 1}`} 
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </button>
                                                        </SwiperSlide>
                                                    );
                                                })}
                                            </Swiper>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-[280px] md:h-[360px] flex flex-col items-center justify-center text-gray-300 bg-[#F8FAFA] shrink-0">
                                    <BedDouble size={64} className="mb-4 opacity-50 text-gray-400" />
                                    <p className="text-xs uppercase font-black tracking-widest">{t('No Images Configured', 'कोई छवि उपलब्ध नहीं')}</p>
                                </div>
                            )}

                            <div className="p-6 md:p-8 space-y-8 flex-1">
                                {/* Header Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm ${
                                            isAvailable 
                                                ? 'bg-green-50 border border-green-100 text-green-700' 
                                                : 'bg-red-50 border border-red-100 text-red-700'
                                        }`}>
                                            {isAvailable 
                                                ? `${room.quantity} ${t('Rooms Available', 'कमरे उपलब्ध')}` 
                                                : t('Sold Out', 'बुक हो गया')
                                            }
                                        </span>
                                        <div className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 border border-teal-100 rounded-xl text-[#0F4C4C]">
                                            <Star size={12} className="fill-teal-700 text-teal-700" />
                                            <span className="text-[10px] font-black">4.9</span>
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-3xl font-black text-[#0F4C4C] tracking-tight leading-tight">
                                        {room.name}
                                    </h2>

                                    <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-1">
                                        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#2E7D7D]" /> Kumarakom, Kerala</span>
                                        <span className="flex items-center gap-1.5"><Users size={12} className="text-[#2E7D7D]" /> {room.capacity} {t('Guests max', 'अधिकतम अतिथि')}</span>
                                        <span className="flex items-center gap-1.5"><BedDouble size={12} className="text-[#2E7D7D]" /> {room.type}</span>
                                    </div>
                                </div>

                                {/* Price block */}
                                <div className="p-5 bg-[#F8FAFA] rounded-3xl border border-gray-100 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('Rate details', 'दर विवरण')}</p>
                                        <p className="text-xs font-bold text-gray-500">{t('Standard Rate Plan', 'मानक दर योजना')}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-[#0F4C4C] tracking-tighter">₹{room.price.toLocaleString()}</span>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none">{t('per night', 'प्रति रात')}</span>
                                    </div>
                                </div>

                                {/* Description Box */}
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('About this Sanctuary', 'इस अभयारण्य के बारे में')}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                        {room.description || t('No description available for this luxury sanctuary.', 'इस अभयारण्य का विवरण अनुपलब्ध है।')}
                                    </p>
                                </div>

                                {/* Facilities (populated list) */}
                                {room.facilities && room.facilities.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Integrated Facilities', 'एकीकृत सुविधाएं')}</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {room.facilities.map((fac, idx) => (
                                                <div key={fac._id || idx} className="flex items-center gap-3 p-3 bg-[#F8FAFA] border border-gray-50 rounded-2xl">
                                                    {fac.image ? (
                                                        <img 
                                                            src={getImageUrl(fac.image)} 
                                                            className="w-5 h-5 object-contain opacity-80" 
                                                            alt="" 
                                                        />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-lg bg-teal-50 flex items-center justify-center text-primary">
                                                            <Sparkles size={12} className="text-[#0F4C4C]" />
                                                        </div>
                                                    )}
                                                    <span className="text-xs font-bold text-gray-600 truncate">{fac.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Amenities list */}
                                {room.amenities && room.amenities.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Included Services', 'शामिल सेवाएं')}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {room.amenities.map((amenity, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="px-3.5 py-2 bg-white text-gray-500 text-[10px] font-bold rounded-xl border border-gray-100 uppercase tracking-widest flex items-center gap-2 shadow-sm"
                                                >
                                                    {renderAmenityIcon(amenity)}
                                                    {t(amenity, amenity)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Booking Form */}
                        <div className="w-full md:w-[52%] p-6 md:p-8 lg:p-12 flex flex-col justify-between flex-1 md:h-full md:overflow-y-auto no-scrollbar min-h-0">
                            {isAvailable ? (
                                !bookingSuccess ? (
                                    <div className="h-full flex flex-col justify-between">
                                        <div className="space-y-6">
                                            {/* Progress / Steps Header */}
                                            <div className="space-y-4">
                                                <div className="flex gap-3">
                                                    <div className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= 1 ? 'bg-[#0F4C4C]' : 'bg-gray-100'}`}></div>
                                                    <div className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= 2 ? 'bg-[#0F4C4C]' : 'bg-gray-100'}`}></div>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black text-[#0F4C4C] tracking-tight">
                                                    {step === 1 ? t('Reserve Your Sanctuary', 'तिथियां चुनें') : t('Guest Information', 'विवरण भरें')}
                                                </h3>
                                                <p className="text-gray-400 text-xs leading-normal">
                                                    {step === 1 
                                                        ? t('Select the dates for your unforgettable Kerala experience.', 'अपने केरल अनुभव के लिए तिथियां चुनें।') 
                                                        : t('Please provide your details to finalize the reservation.', 'आरक्षण पूरा करने के लिए अपना विवरण दें।')
                                                    }
                                                </p>
                                            </div>

                                            {/* Booking Form */}
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                {step === 1 ? (
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Check In', 'आगमन')}</label>
                                                                <div className="relative group">
                                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors z-10" size={16} />
                                                                    <DatePicker
                                                                        selected={formData.checkIn}
                                                                        onChange={(date) => handleDateChange('checkIn', date)}
                                                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                                        placeholderText={t('Select Date', 'तिथि चुनें')}
                                                                        minDate={new Date()}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Check Out', 'प्रस्थान')}</label>
                                                                <div className="relative group">
                                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors z-10" size={16} />
                                                                    <DatePicker
                                                                        selected={formData.checkOut}
                                                                        onChange={(date) => handleDateChange('checkOut', date)}
                                                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                                        placeholderText={t('Select Date', 'तिथि चुनें')}
                                                                        minDate={formData.checkIn || new Date()}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Adults', 'वयस्क')}</label>
                                                                <select 
                                                                    name="adults" 
                                                                    value={formData.adults} 
                                                                    onChange={handleInputChange}
                                                                    className="w-full bg-gray-50 border-none rounded-2xl p-3.5 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                                >
                                                                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                                                </select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Children', 'बच्चे')}</label>
                                                                <select 
                                                                    name="children" 
                                                                    value={formData.children} 
                                                                    onChange={handleInputChange}
                                                                    className="w-full bg-gray-50 border-none rounded-2xl p-3.5 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                                >
                                                                    {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Full Name', 'पूरा नाम')}</label>
                                                            <div className="relative group">
                                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={16} />
                                                                <input 
                                                                    type="text" 
                                                                    name="guestName" 
                                                                    value={formData.guestName} 
                                                                    onChange={handleInputChange}
                                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                                    placeholder="John Doe"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Email', 'ईमेल')}</label>
                                                                <div className="relative group">
                                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={16} />
                                                                    <input 
                                                                        type="email" 
                                                                        name="email" 
                                                                        value={formData.email} 
                                                                        onChange={handleInputChange}
                                                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                                        placeholder="john@example.com"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Phone', 'फ़ोन')}</label>
                                                                <div className="relative group">
                                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={16} />
                                                                    <input 
                                                                        type="tel" 
                                                                        name="phone" 
                                                                        value={formData.phone} 
                                                                        onChange={handleInputChange}
                                                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                                        placeholder="+91 00000 00000"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Special Requests', 'विशेष अनुरोध')}</label>
                                                            <textarea 
                                                                name="specialRequests" 
                                                                value={formData.specialRequests} 
                                                                onChange={handleInputChange}
                                                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] h-20 resize-none outline-none transition-all"
                                                                placeholder={t('Anything we should know?', 'कुछ भी जो हमें जानना चाहिए?')}
                                                            ></textarea>
                                                        </div>

                                                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                                                            <input 
                                                                type="checkbox" 
                                                                id="terms"
                                                                required
                                                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#0F4C4C] focus:ring-[#0F4C4C] cursor-pointer"
                                                            />
                                                            <label htmlFor="terms" className="text-[10px] text-gray-500 leading-relaxed cursor-pointer select-none">
                                                                {t('I agree to the', 'मैं सहमत हूँ')} <Link to="/terms-conditions" target="_blank" className="text-[#0F4C4C] font-bold underline hover:text-[#2E7D7D] transition-colors">{t('Terms & Conditions', 'नियम और शर्तें')}</Link> {t('and', 'और')} <Link to="/privacy-policy" target="_blank" className="text-[#0F4C4C] font-bold underline hover:text-[#2E7D7D] transition-colors">{t('Privacy Policy', 'गोपनीयता नीति')}</Link> {t('of Lake Breeze Resorts.', 'लेक ब्रीज रिसॉर्ट्स का।')}
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Total Price Banner inside booking form */}
                                                {totalPrice > 0 && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-center justify-between text-[#0F4C4C]"
                                                    >
                                                        <div className="space-y-0.5">
                                                            <p className="text-[8px] font-black uppercase tracking-widest text-[#2E7D7D]">{t('Calculated Price', 'कुल अनुमानित राशि')}</p>
                                                            <p className="text-[10px] font-bold text-gray-500">
                                                                {t('Stay duration', 'कुल रातें')}: {Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))} {t('nights', 'रातें')}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xl font-black tracking-tighter">₹{totalPrice.toLocaleString()}</span>
                                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none">{t('Total', 'कुल')}</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Actions */}
                                                <div className="pt-4 flex gap-4">
                                                    {step === 2 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setStep(1)}
                                                            className="flex-1 py-4 bg-white border border-gray-200 text-gray-400 rounded-full font-black uppercase text-[10px] tracking-widest hover:border-[#0F4C4C] hover:text-[#0F4C4C] transition-all active:scale-95 cursor-pointer"
                                                        >
                                                            {t('Back', 'पीछे')}
                                                        </button>
                                                    )}
                                                    <button 
                                                        type="submit" 
                                                        disabled={isSubmitting}
                                                        className="flex-1 bg-[#0F4C4C] text-white py-4 rounded-full font-black uppercase text-[10px] tracking-[0.25em] shadow-[0_20px_40px_-10px_rgba(15,76,76,0.35)] hover:bg-[#2E7D7D] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {isSubmitting ? t('Processing...', 'प्रक्रिया...') : (
                                                            <span className="flex items-center justify-center gap-2">
                                                                {step === 1 ? t('Continue', 'जारी रखें') : t('Confirm Stay', 'पुष्टि करें')}
                                                                <ChevronRight size={14} />
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    /* Success View */
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8 space-y-6 h-full flex flex-col justify-center items-center"
                                    >
                                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm shrink-0">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-[#0F4C4C] tracking-tight leading-tight">
                                            {t('Sanctuary Reserved!', 'बुकिंग पक्की हो गई!', 'മുറി റിസർവ് ചെയ്തിരിക്കുന്നു!')}
                                        </h3>
                                        <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed">
                                            {t('Your stay at', 'आपका प्रवास', 'നിങ്ങളുടെ താമസം')} <span className="text-[#0F4C4C] font-bold">{room.name}</span> {t('has been secured. A confirmation email has been sent to you.', 'पक्का कर लिया गया है। आपको एक ईमेल भेजा गया है।', 'ഉറപ്പാക്കിയിരിക്കുന്നു. ഒരു സ്ഥിരീകരണ ഇമെയിൽ അയച്ചിട്ടുണ്ട്.')}
                                        </p>
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-block relative group">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#0F4C4C] text-white rounded-full text-[7px] font-black uppercase tracking-[0.4em]">{t('Booking ID', 'आईडी', 'ബുക്കിംഗ് ഐഡി')}</div>
                                            <p className="text-lg font-mono font-bold text-[#0F4C4C] tracking-tighter">{bookingSuccess.bookingReference}</p>
                                        </div>
                                        <div className="pt-4 w-full">
                                            <button 
                                                onClick={onClose} 
                                                className="w-full py-4 bg-[#0F4C4C] text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-[#2E7D7D] transition-all active:scale-95 cursor-pointer"
                                            >
                                              {t('Dismiss', 'बंद करें', 'ശരി')}
                                            </button>
                                        </div>
                                    </motion.div>
                                )
                            ) : (
                                /* Sold Out View */
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm">
                                        <X size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-[#0F4C4C] uppercase tracking-wider">{t('Room Sold Out', 'कमरा बुक हो चुका है')}</h3>
                                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                                        {t('This luxury sanctuary is temporarily unavailable for reservations. Please browse our other exquisite rooms.', 'यह अभयारण्य अभी बुकिंग के लिए उपलब्ध नहीं है। कृपया हमारी अन्य श्रेणियां देखें।')}
                                    </p>
                                    <button 
                                        onClick={onClose} 
                                        className="w-full py-4 bg-gray-100 text-gray-500 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
                                    >
                                        {t('Dismiss', 'बंद करें', 'ശരി')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RoomDetailsModal;
