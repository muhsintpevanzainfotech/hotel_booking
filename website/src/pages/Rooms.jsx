import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRoomsRequest } from '../redux/slices/roomSlice';
import { Star, MapPin, Users, Waves, Wind, Coffee, Shield, Heart, Search, Filter, SlidersHorizontal } from 'lucide-react';
import BookingModal from '../components/rooms/BookingModal';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageHelper';
import useSEO from '../hooks/useSEO';
import roomImg from '../assets/images/room.jpeg';
import roomsImg from '../assets/images/rooms.jpeg';
import masterbedroomImg from '../assets/images/masterbedroom.jpeg';

const Rooms = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: rooms, loading, error } = useSelector((state) => state.rooms);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All Rooms');
    const { t } = useLanguage();

    useSEO(
        t('Luxury Suites & cottages', 'लक्जरी सुइट्स और कॉटेज', 'ഡീലക്സ് കോട്ടേജുകൾ'),
        t('Browse our curated sanctuaries. Choose between Deluxe, Premium, and Family Waterfront Cottages at Lake Breeze Resorts.', 'हमारे शानदार कॉटेज और कमरों की सूची देखें।')
    );

    useEffect(() => {
        dispatch(fetchRoomsRequest());
    }, [dispatch]);

    const filteredRooms = rooms.filter(room => {
        if (activeCategory === 'All Rooms') return true;
        return room.type?.toLowerCase() === activeCategory.toLowerCase();
    });

    const handleBookClick = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleViewClick = (room) => {
        const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
        navigate(`/rooms/${slugify(room.name)}`);
    };

    return (
        <div className="bg-[#F8FAFA] min-h-screen font-poppins pb-24">
            {/* Page Header */}
            <section className="px-4 py-4 md:px-8 md:py-6 bg-white w-full max-w-[1400px] mx-auto">
                <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col justify-center items-center text-center shadow-md">
                    {/* Background image & Overlay */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img
                            src={roomsImg}
                            alt="Rooms Banner"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                        {/* Dark green gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/90 via-[#0F4C4C]/80 to-teal-900/60 backdrop-blur-[1px]" />
                    </div>
                    
                    {/* Header Text Content */}
                    <div className="relative z-10 text-white space-y-3 px-4 sm:px-6">
                        <div className="flex items-center justify-center gap-2 text-teal-300 opacity-80">
                            <Star size={16} className="text-teal-300 fill-teal-300" />
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">{t('Exquisite Stay', 'उत्कृष्ट प्रवास', 'അതിവിശിഷ്ടമായ താമസം')}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-none text-white animate-fade-in">
                            {t('Our Sanctuaries', 'हमारे अभयारण्य', 'ഞങ്ങളുടെ സങ്കേതങ്ങൾ')}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-teal-200">
                            <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम', 'ഹോം')}</Link>
                            <span>•</span>
                            <span className="text-white">{t('Rooms', 'कमरे', 'മുറികൾ')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Bar - COMPACT */}
            <div className="max-w-[1100px] mx-auto px-6 -mt-8 relative z-20">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
                        {['All Rooms', 'Deluxe', 'Premium', 'Family', 'Budget'].map((cat, i) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-4 py-2 transition-all ${activeCategory === cat ? 'bg-neutral-950 text-white shadow-lg rounded-full' : 'text-gray-400 hover:text-neutral-950 rounded-full'}`}
                            >
                                {t(cat, cat)}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                         <button className="p-3 bg-gray-50 rounded-full text-neutral-950 hover:bg-gray-100 transition-all"><Search size={18} /></button>
                         <button className="p-3 bg-gray-50 rounded-full text-neutral-950 hover:bg-gray-100 transition-all"><SlidersHorizontal size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Rooms Grid - REDUCED MAX-WIDTH */}
            <div className="max-w-[1100px] mx-auto px-6 py-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-gray-100 rounded-[32px] aspect-[4/5] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredRooms.map((room) => (
                             <motion.div 
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 whileInView={{ opacity: 1, scale: 1 }}
                                 viewport={{ once: true }}
                                 key={room._id || room.id} 
                                 className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-50"
                             >
                                <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => handleViewClick(room)}>
                                    <img 
                                        src={room.images?.[0]?.url ? getImageUrl(room.images[0].url) : roomImg} 
                                        alt={room.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    />
                                    <div className="absolute top-4 right-4 p-2.5 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all shadow-lg" onClick={(e) => e.stopPropagation()}>
                                        <Heart size={16} />
                                    </div>
                                    <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest text-[#0F4C4C] shadow-lg">
                                        {room.type}
                                    </div>
                                </div>
                                
                                <div className="p-8 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={10} /> Kumarakom, Kerala</p>
                                            <h3 className="text-xl font-bold text-[#0F4C4C] tracking-tight cursor-pointer hover:text-secondary transition-colors" onClick={() => handleViewClick(room)}>{room.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F8FAFA] rounded-lg border border-gray-100">
                                            <Star size={12} className="text-teal-600 fill-teal-600" />
                                            <span className="text-[10px] font-black text-teal-800">4.9</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest"><Users size={12} /> {room.capacity} {t('Guests', 'अतिथि')}</div>
                                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest"><Waves size={12} /> {t('Lake View', 'लेк व्यू')}</div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black text-[#0F4C4C] tracking-tighter">₹{room.price.toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{t('per night', 'प्रति रात')}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleViewClick(room)}
                                                className="px-4 py-3 text-[8px] font-black uppercase tracking-widest border border-neutral-950 text-neutral-950 rounded-full hover:bg-neutral-50 transition-all"
                                            >
                                                {t('View', 'देखें')}
                                            </button>
                                            <button 
                                                onClick={() => handleBookClick(room)}
                                                className="px-5 py-3 text-[8px] font-black uppercase tracking-widest bg-neutral-950 text-white rounded-full shadow-lg hover:bg-neutral-900 transition-all active:scale-95"
                                            >
                                                {t('Book Now', 'अभी बुक करें')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <BookingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                room={selectedRoom} 
            />
        </div>
    );
};

export default Rooms;
