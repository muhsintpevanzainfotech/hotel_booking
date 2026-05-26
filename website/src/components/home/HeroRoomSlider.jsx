import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getImageUrl } from '../../utils/imageHelper';

const HeroRoomSlider = () => {
  const { items: rooms } = useSelector(state => state.rooms);
  const { t } = useLanguage();

  if (!rooms || rooms.length === 0) return null;

  return (
    <div className="hero-room-slider-wrapper">
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        effect="fade"
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="hero-room-swiper"
      >
        {rooms.slice(0, 5).map((room, index) => (
          <SwiperSlide key={room._id || index}>
            <div className="hero-room-slide">
              <img 
                src={getImageUrl(room.images?.[0]?.url || room.images?.[0])} 
                alt={room.name} 
                className="slide-bg"
              />
              <div className="slide-content-overlay">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="slide-info-card"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={12} className="text-primary fill-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t('Luxury Suite', 'लक्जरी सुइट', 'ലക്സറി സ്യൂട്ട്')}</span>
                  </div>
                  <h3>{room.name}</h3>
                  <p className="price-tag">₹{room.price} <span>/ {t('Night', 'रात', 'രാത്രി')}</span></p>
                  <Link to="/rooms" className="slide-link">
                    {t('View Details', 'विवरण देखें', 'വിവരം കാണുക')} <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className="swiper-controls-custom">
        <button className="swiper-button-prev-custom"><ArrowRight size={20} className="rotate-180" /></button>
        <button className="swiper-button-next-custom"><ArrowRight size={20} /></button>
      </div>
    </div>
  );
};

export default HeroRoomSlider;
