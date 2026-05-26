import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Users, Sparkles, ShieldCheck, Heart, Coffee, Wifi, Check, Trash2, BedDouble } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { useLanguage } from '../../context/LanguageContext';
import { getImageUrl } from '../../utils/imageHelper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RoomDetailsModal = ({ isOpen, onClose, room, onBookNow }) => {
    const { t } = useLanguage();

    if (!room) return null;

    const isAvailable = room.quantity > 0 && room.isAvailable !== false;

    // Helper to map basic amenity names to icons
    const renderAmenityIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('wifi') || lowerName.includes('internet')) {
            return <Wifi size={14} className="text-secondary" />;
        }
        if (lowerName.includes('coffee') || lowerName.includes('tea') || lowerName.includes('breakfast')) {
            return <Coffee size={14} className="text-secondary" />;
        }
        return <Check size={14} className="text-secondary" />;
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
                        className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(15,76,76,0.3)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-white"
                    >
                        {/* Close Button */}
                        <button 
                            onClick={onClose} 
                            className="absolute top-6 right-6 z-30 p-2.5 bg-white/90 hover:bg-white text-primary rounded-full transition-all active:scale-90 shadow-md border border-gray-100"
                        >
                            <X size={20} />
                        </button>

                        {/* Left Side: Images Swiper Gallery */}
                        <div className="w-full md:w-[48%] bg-[#F8FAFA] relative min-h-[220px] md:min-h-[auto] flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
                            {room.images && room.images.length > 0 ? (
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                                    loop={room.images.length > 1}
                                    className="w-full h-full min-h-[220px] md:min-h-[320px] select-none"
                                >
                                    {room.images.map((image, index) => (
                                        <SwiperSlide key={index} className="w-full h-full relative">
                                            <img 
                                                src={getImageUrl(image.url)} 
                                                alt={`${room.name} view ${index + 1}`} 
                                                className="w-full h-full object-cover absolute inset-0"
                                            />
                                            {/* Gradient Overlay for image */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                                            
                                            {/* Image Category Badge */}
                                            {image.category && (
                                                <span className="absolute bottom-6 left-6 px-3.5 py-1.5 bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                                                    {image.category}
                                                </span>
                                            )}
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center py-10 md:py-20 text-gray-300">
                                    <BedDouble size={64} className="mb-4 opacity-50" />
                                    <p className="text-xs uppercase font-black tracking-widest">{t('No Images Configured', 'कोई छवि उपलब्ध नहीं')}</p>
                                </div>
                            )}

                            {/* Floating details overlay on image panel (Desktop only) */}
                            <div className="absolute bottom-6 right-6 z-20 pointer-events-none hidden lg:block">
                                <div className="flex gap-2">
                                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[8px] font-black text-primary rounded-xl uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                                        <Sparkles size={10} />
                                        {t('Premium Resort', 'प्रीमियम रिसॉर्ट')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Details & Specifications */}
                        <div className="w-full md:w-[52%] p-6 md:p-8 lg:p-12 overflow-y-auto no-scrollbar flex flex-col justify-between flex-1 min-h-0">
                            <div className="space-y-8">
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
                                        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-secondary" /> Kumarakom, Kerala</span>
                                        <span className="flex items-center gap-1.5"><Users size={12} className="text-secondary" /> {room.capacity} {t('Guests max', 'अधिकतम अतिथि')}</span>
                                        <span className="flex items-center gap-1.5"><BedDouble size={12} className="text-secondary" /> {room.type}</span>
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
                                                            <Sparkles size={12} />
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

                            {/* Booking CTA Buttons */}
                            <div className="pt-8 mt-8 border-t border-gray-100 flex gap-4">
                                <button 
                                    onClick={onClose} 
                                    className="flex-1 py-5 bg-white border border-gray-200 text-gray-400 rounded-full font-black uppercase text-[10px] tracking-widest hover:border-[#0F4C4C] hover:text-[#0F4C4C] transition-all active:scale-95"
                                >
                                    {t('Close', 'बंद करें')}
                                </button>
                                <button 
                                    onClick={() => {
                                        onClose();
                                        onBookNow(room);
                                    }}
                                    disabled={!isAvailable}
                                    className="flex-[2] py-5 bg-[#0F4C4C] text-white rounded-full font-black uppercase text-[10px] tracking-[0.25em] shadow-[0_20px_40px_-10px_rgba(15,76,76,0.35)] hover:bg-[#2E7D7D] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    {isAvailable ? t('Book Now', 'अभी बुक करें') : t('Sold Out', 'बुक हो गया')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RoomDetailsModal;
