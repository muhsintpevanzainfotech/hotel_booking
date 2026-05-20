import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomsRequest } from '../redux/slices/roomSlice';
import { Link } from 'react-router-dom';
import { Star, Heart, MapPin, Waves, Users, Zap, Shield, Check, Phone, Home as HomeIcon, Layout, CreditCard, Sparkles, Coffee, Utensils, Wifi, Wind, Car, Camera, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const Home = () => {
  const dispatch = useDispatch();
  const { items: allRooms, loading } = useSelector(state => state.rooms);
  const rooms = allRooms.slice(0, 6);
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('Rooms');

  const [facilities, setFacilities] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    dispatch(fetchRoomsRequest());

    const fetchContent = async () => {
      try {
        const [facRes, testRes, galRes, banRes, offRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE}/facilities`),
          fetch(`${import.meta.env.VITE_API_BASE}/testimonials`),
          fetch(`${import.meta.env.VITE_API_BASE}/gallery`),
          fetch(`${import.meta.env.VITE_API_BASE}/banners`),
          fetch(`${import.meta.env.VITE_API_BASE}/offers`)
        ]);

        if (facRes.ok) setFacilities(await facRes.json());
        if (testRes.ok) setTestimonials(await testRes.json());
        if (galRes.ok) {
          const gallery = await galRes.json();
          setGalleryItems(gallery.slice(0, 6));
        }
        if (banRes.ok) setBanners(await banRes.json());
        if (offRes.ok) setOffers(await offRes.json());
      } catch (error) {
        console.error("Failed to fetch home content", error);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchContent();
  }, [dispatch]);

  const categories = [
    { name: 'Rooms', icon: <HomeIcon size={24} />, key: 'rooms' },
    { name: 'Lake View', icon: <Waves size={24} />, key: 'lake' },
    { name: 'Family', icon: <Users size={24} />, key: 'family' },
    { name: 'Budget', icon: <CreditCard size={24} />, key: 'budget' },
    { name: 'Premium', icon: <Sparkles size={24} />, key: 'premium' },
  ];

  return (
    <div className="bg-[#F8FAFA] min-h-screen font-poppins pb-24 md:pb-0">
      {/* 1. HERO SECTION - REDUCED HEIGHT AND TEXT SIZE */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src="/hero_bright.png"
          alt="Resort"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/20 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-60">{t('Est. 1994 • Kumarakom', 'स्थापना 1994 • कुमारकोम')}</p>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none">
              {t('Lake Breeze', 'लेक ब्रीज')}
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-xl mx-auto leading-relaxed mb-10">
              {t('Architectural sanctuaries where the horizon meets unrivaled luxury.', 'वास्तुशिल्प अभयारण्य जहाँ क्षितिज बेजोड़ विलासिता से मिलता है।')}
            </p>
          </motion.div>
        </div>

        {/* Floating Booking Bar - MORE COMPACT */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[1000px] px-6">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="bg-white/90 backdrop-blur-2xl p-8 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col lg:flex-row gap-6 items-end"
          >
            {[t('Check-in', 'आगमन'), t('Check-out', 'प्रस्थान')].map((label, i) => (
              <div key={i} className="flex-1 w-full space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C] ml-1">{label}</label>
                <input type="date" className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none" />
              </div>
            ))}
            <div className="flex-[1.5] w-full flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C] ml-1">{t('Adults', 'वयस्क')}</label>
                <input type="number" min="1" defaultValue="2" className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] outline-none" />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C] ml-1">{t('Children', 'बच्चे')}</label>
                <input type="number" min="0" defaultValue="0" className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] outline-none" />
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/rooms'}
              className="bg-[#0F4C4C] text-white px-10 py-4 rounded-xl font-black uppercase text-[9px] tracking-[0.3em] hover:bg-[#2E7D7D] transition-all shadow-xl active:scale-95 whitespace-nowrap"
            >
              {t('Book Stay', 'स्टे बुक करें')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. ROOM SECTION - REDUCED PADDING */}
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-600">{t('Our Sanctuaries', 'हमारे अभयारण्य')}</p>
            <h2 className="text-4xl font-black text-[#0F4C4C] tracking-tight">{t('Curated Stays', 'क्यूरेटेड स्टे')}</h2>
          </div>
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex flex-col items-center gap-2 min-w-fit transition-all relative ${activeCategory === cat.name ? 'text-[#0F4C4C]' : 'text-gray-300 hover:text-gray-500'}`}
              >
                <div className={`transition-all duration-300 ${activeCategory === cat.name ? 'scale-105 text-[#0F4C4C]' : 'opacity-50'}`}>
                  {React.cloneElement(cat.icon, { size: 20 })}
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{t(cat.name, cat.name)}</span>
                {activeCategory === cat.name && <motion.div layoutId="catBar" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0F4C4C]"></motion.div>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? [1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[32px] animate-pulse"></div>) :
            rooms.map((room, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group">
                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-6 shadow-xl border border-white">
                  <img src={room.images?.[0]?.url ? `${import.meta.env.VITE_SERVER_URL}/${room.images[0].url}` : '/room_deluxe.png'} alt={room.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute top-6 left-6 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest text-[#0F4C4C] shadow-lg">
                    {room.type}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#0F4C4C] tracking-tight">{room.name}</h3>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F8FAFA] rounded-lg border border-gray-100">
                      <Star size={12} className="text-teal-600 fill-teal-600" />
                      <span className="text-[10px] font-black text-teal-800">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Users size={12} /> 2 Guests</span>
                    <span className="flex items-center gap-1.5"><Waves size={12} /> Lake View</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                    <p className="text-xl font-black text-[#0F4C4C] tracking-tighter">₹{room.price} <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">/ night</span></p>
                    <button
                      onClick={() => window.location.href = '/rooms'}
                      className="px-6 py-3 bg-[#0F4C4C] text-white rounded-xl font-black uppercase text-[8px] tracking-widest shadow-lg hover:bg-[#2E7D7D] transition-all active:scale-95"
                    >
                      {t('Book Now', 'अभी बुक करें')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>

      {/* 2.5 EXCLUSIVE OFFERS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-600">Limited Time</p>
              <h2 className="text-4xl font-black text-[#0F4C4C] tracking-tight">Exclusive Offers</h2>
            </div>
            <Link to="/rooms" className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F4C4C] border-b-2 border-[#0F4C4C] pb-1 hover:text-teal-600 hover:border-teal-600 transition-all">
              View All Deals
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.length > 0 ? offers.slice(0, 3).map((offer, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className={`bg-teal-50 p-10 rounded-[40px] border border-white shadow-sm flex flex-col justify-between h-full relative overflow-hidden group`}
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform">
                  <Zap size={80} className="text-[#0F4C4C]" />
                </div>
                <div>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0F4C4C] mb-8 shadow-sm">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-[#0F4C4C] mb-2">{offer.title}</h3>
                  <p className="text-4xl font-black text-teal-600 mb-6 tracking-tighter">{offer.discount}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-8">{offer.description}</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-black/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0F4C4C]">Code: {offer.code}</span>
                  <button className="text-[10px] font-black uppercase tracking-widest text-teal-600 hover:underline">Apply Now</button>
                </div>
              </motion.div>
            )) : (
              [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50 rounded-[40px] animate-pulse"></div>)
            )}
          </div>
        </div>
      </section>

      {/* 3. FACILITIES SECTION - MORE COMPACT */}
      <section id="facilities" className="bg-white py-16 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-teal-600">{t('World-Class', 'विश्व स्तरीय')}</p>
            <h2 className="text-4xl font-black text-[#0F4C4C] tracking-tight">{t('Refined Facilities', 'परिष्कृत सुविधाएं')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.length > 0 ? facilities.map((fac, i) => {
              const IconMap = {
                pool: Waves, waves: Waves, wind: Wind, coffee: Coffee,
                utensils: Utensils, dining: Utensils, wifi: Wifi,
                car: Car, transport: Car, camera: Camera, photography: Camera,
                map: MapPin, location: MapPin, sparkles: Sparkles
              };
              const IconComponent = IconMap[fac.icon?.toLowerCase()] || Sparkles;
              const coverImg = fac.coverImage ? `${import.meta.env.VITE_SERVER_URL}/${fac.coverImage}` : null;

              return (
                <motion.div key={i} whileHover={{ y: -8 }} className={`relative p-10 rounded-[32px] border ${coverImg ? 'border-none' : 'border-gray-50'} group hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col ${coverImg ? '' : 'bg-[#F8FAFA] hover:bg-[#0F4C4C]'}`}>
                  {coverImg && (
                    <div className="absolute inset-0 z-0">
                      <img src={coverImg} alt={fac.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-[#0F4C4C]/60 group-hover:bg-[#0F4C4C]/80 transition-colors duration-500"></div>
                    </div>
                  )}
                  <div className="relative z-10 flex-1 transition-colors duration-500">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform overflow-hidden relative ${coverImg ? 'bg-white/20 backdrop-blur-md text-white border border-white/20' : 'bg-white text-[#0F4C4C]'}`}>
                      {fac.image ? (
                        <img src={`${import.meta.env.VITE_SERVER_URL}/${fac.image}`} alt={fac.title} className="w-full h-full object-cover" />
                      ) : (
                        <IconComponent size={28} />
                      )}
                      <div className="absolute inset-0 bg-[#0F4C4C]/0 group-hover:bg-[#0F4C4C] transition-colors flex items-center justify-center">
                        <IconComponent size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <h4 className={`text-xl font-bold mb-3 transition-colors ${coverImg ? 'text-white' : 'text-[#0F4C4C] group-hover:text-white'}`}>{fac.title}</h4>
                    <p className={`text-xs leading-relaxed transition-colors ${coverImg ? 'text-teal-50' : 'text-gray-500 group-hover:text-teal-100'}`}>{fac.description}</p>
                  </div>
                </motion.div>
              );
            }) : (
              [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50 rounded-[32px] animate-pulse"></div>)
            )}
          </div>
        </div>
      </section>

      {/* 4. GALLERY SECTION */}
      <section className="py-16 bg-[#F8FAFA]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl font-black text-[#0F4C4C] tracking-tight">{t('The Visual Journal', 'दृश्य पत्रिका')}</h2>
            <Link to="/gallery" className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F4C4C] border-b-2 border-[#0F4C4C] pb-1 hover:text-teal-600 hover:border-teal-600 transition-all">
              {t('View All', 'सब देखें')}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.length > 0 ? galleryItems.map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className="aspect-square rounded-[32px] overflow-hidden shadow-xl relative group border border-white">
                <img src={`${import.meta.env.VITE_SERVER_URL}/${item.image}`} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Sparkles className="text-white" size={24} />
                </div>
              </motion.div>
            )) : (
              ['/hero_bright.png', '/room_deluxe.png', '/room_family.png', '/room1.jpg', '/hero_bright.png', '/room_deluxe.png'].map((img, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }} className="aspect-square rounded-[32px] overflow-hidden shadow-xl relative group border border-white">
                  <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Sparkles className="text-white" size={24} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIAL SECTION */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl opacity-50"></div>
        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 mb-20">
            <Quote size={40} className="text-teal-600 opacity-20" />
            <h2 className="text-4xl font-black text-[#0F4C4C] tracking-tight leading-tight">{t('Echoes of Excellence', 'उत्कृष्टता की प्रतिध्वनि')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? testimonials.map((test, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="p-10 bg-[#F8FAFA] rounded-[32px] border border-gray-100 shadow-sm relative">
                <div className="flex gap-1 text-teal-600 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                </div>
                <p className="text-lg font-medium text-[#0F4C4C] leading-relaxed mb-8 italic">"{test.content}"</p>
                <div className="flex items-center gap-4">
                  {test.image && <img src={`${import.meta.env.VITE_SERVER_URL}/${test.image}`} alt={test.name} className="w-12 h-12 rounded-full object-cover shadow-md" />}
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-[#0F4C4C]">{test.name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            )) : (
              [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50 rounded-[32px] animate-pulse"></div>)
            )}
          </div>
        </div>
      </section>

      {/* 5.5 PROMOTIONAL BANNER */}
      <section className="py-12 px-6">
        {banners.length > 0 ? (
          (() => {
            const activeBanner = banners.find(b => b.isActive) || banners[0];
            return (
              <div className="max-w-[1100px] mx-auto relative h-[400px] rounded-[48px] overflow-hidden shadow-2xl group">
                <img
                  src={activeBanner.image ? `${import.meta.env.VITE_SERVER_URL}/${activeBanner.image}` : "/hero_bright.png"}
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
          <div className="max-w-[1100px] mx-auto relative h-[400px] rounded-[48px] overflow-hidden shadow-2xl group">
            <img
              src="/hero_bright.png"
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

      {/* 6. CTA SECTION - MORE COMPACT */}
      <section className="py-16 px-6">
        <div className="max-w-[1100px] mx-auto bg-[#0F4C4C] rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-transparent to-black/30"></div>
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{t('Reserve Your Paradise', 'अपना स्वर्ग आरक्षित करें')}</h2>
            <p className="text-lg md:text-xl font-light text-teal-100 max-w-xl mx-auto opacity-80">{t('Direct bookings on WhatsApp enjoy priority upgrades and exclusive estate amenities.', 'सीधी बुकिंग पर प्राथमिकता अपग्रेड का आनंद लें।')}</p>
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
    </div>
  );
};

export default Home;
