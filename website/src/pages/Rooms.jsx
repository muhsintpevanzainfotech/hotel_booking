import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomsRequest } from '../redux/slices/roomSlice';
import { Star, MapPin, Users, Waves, Wind, Coffee, Shield, Heart, Search, Filter, SlidersHorizontal } from 'lucide-react';
import BookingModal from '../components/rooms/BookingModal';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const Rooms = () => {
    const dispatch = useDispatch();
    const { items: rooms, loading, error } = useSelector((state) => state.rooms);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All Rooms');
    const { t } = useLanguage();

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

    return (
        <div className="bg-[#F8FAFA] min-h-screen font-poppins pb-24">
            {/* Header - REDUCED PADDING */}
            <header className="bg-[#0F4C4C] text-white py-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-3xl"></div>
                <div className="max-w-[1100px] mx-auto px-6 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">{t('Our Sanctuaries', 'हमारे अभयारण्य')}</h1>
                        <p className="text-teal-100 text-lg opacity-80 max-w-xl">{t('Explore our curated collection of lake-view rooms and premium suites.', 'हमारे लेक-व्यू रूम और प्रीमियम सुइट्स के संग्रह का अन्वेषण करें।')}</p>
                    </motion.div>
                </div>
            </header>

            {/* Filter Bar - COMPACT */}
            <div className="max-w-[1100px] mx-auto px-6 -mt-8 relative z-20">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
                        {['All Rooms', 'Deluxe', 'Premium', 'Family', 'Budget'].map((cat, i) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-4 py-2 rounded-lg transition-all ${activeCategory === cat ? 'bg-[#0F4C4C] text-white shadow-lg' : 'text-gray-400 hover:text-[#0F4C4C]'}`}
                            >
                                {t(cat, cat)}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                         <button className="p-3 bg-gray-50 rounded-xl text-[#0F4C4C] hover:bg-gray-100 transition-all"><Search size={18} /></button>
                         <button className="p-3 bg-gray-50 rounded-xl text-[#0F4C4C] hover:bg-gray-100 transition-all"><SlidersHorizontal size={18} /></button>
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
                                key={room._id} 
                                className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-50"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img 
                                        src={room.images?.[0]?.url ? `${import.meta.env.VITE_SERVER_URL}/${room.images[0].url}` : '/room_deluxe.png'} 
                                        alt={room.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    />
                                    <div className="absolute top-4 right-4 p-2.5 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all shadow-lg">
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
                                            <h3 className="text-xl font-bold text-[#0F4C4C] tracking-tight">{room.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F8FAFA] rounded-lg border border-gray-100">
                                            <Star size={12} className="text-teal-600 fill-teal-600" />
                                            <span className="text-[10px] font-black text-teal-800">4.9</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest"><Users size={12} /> {room.capacity} {t('Guests', 'अतिथि')}</div>
                                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest"><Waves size={12} /> {t('Lake View', 'लेक व्यू')}</div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black text-[#0F4C4C] tracking-tighter">₹{room.price.toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{t('per night', 'प्रति रात')}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-3 text-[8px] font-black uppercase tracking-widest border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">{t('View', 'देखें')}</button>
                                            <button 
                                                onClick={() => handleBookClick(room)}
                                                className="px-5 py-3 text-[8px] font-black uppercase tracking-widest bg-[#0F4C4C] text-white rounded-xl shadow-lg hover:bg-[#2E7D7D] transition-all active:scale-95"
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
