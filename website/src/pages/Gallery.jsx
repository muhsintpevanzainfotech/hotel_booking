import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';
import useSEO from '../hooks/useSEO';
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

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(9);
  const { t } = useLanguage();

  useSEO(
    t('Visual Gallery & Estate Views', 'चित्र दीर्घा', 'ചിത്രശാല'),
    t('Take a visual tour of Lake Breeze Resorts. Browse stunning photographs of our water-facing cottages, backwater tours, and spa sanctuaries.', 'लेक ब्रीज रिसॉर्ट्स की सुंदर तस्वीरें और नज़ारे देखें।')
  );

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/gallery`);
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch gallery", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 6);
  };

  const displayItems = items.slice(0, displayLimit);
  const hasMore = items.length > displayLimit;

  return (
    <div className="bg-[#F8FAFA] min-h-screen">
      {/* Page Header */}
      <section className="px-4 py-4 md:px-8 md:py-6 bg-white w-full max-w-[1400px] mx-auto">
        <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col justify-center items-center text-center shadow-md">
          {/* Background image & Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={bgImg}
              alt="Gallery Banner"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Dark green gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/90 via-[#0F4C4C]/80 to-teal-900/60 backdrop-blur-[1px]" />
          </div>
          
          {/* Header Text Content */}
          <div className="relative z-10 text-white space-y-3 px-4 sm:px-6">
            <div className="flex items-center justify-center gap-2 text-teal-300 opacity-80">
              <ImageIcon size={16} className="text-teal-300" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">{t('Visual Journey', 'दृश्य यात्रा', 'കാഴ്ച')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
              {t('Photo Gallery', 'फोटो गैलरी', 'ഗാലറി')}
            </h1>
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-teal-200">
              <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम', 'ഹോം')}</Link>
              <span>•</span>
              <span className="text-white">{t('Gallery', 'ഗാലറി', 'ഗാലറി')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 max-w-[1200px] mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square bg-white rounded-3xl animate-pulse shadow-sm"></div>)}
          </div>
        ) : (
          <div className="space-y-16">
            {displayItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayItems.map((item, i) => {
                  const isString = typeof item === 'string';
                  const imgSrc = isString ? item : getImageUrl(item.image);
                  
                  return (
                    <motion.div 
                      key={isString ? i : item._id} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i % 3) * 0.1 }}
                      className="group relative overflow-hidden rounded-[32px] shadow-xl border border-white aspect-square"
                    >
                      <img 
                        src={imgSrc} 
                        alt="Gallery" 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                         <div className="p-4 bg-white/20 rounded-full text-white border border-white/40"><Search size={24} /></div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm max-w-full">
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-[0.2em]">
                  {t('No gallery images available', 'कोई गैलरी चित्र उपलब्ध नहीं हैं')}
                </p>
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  className="px-10 py-4 bg-neutral-950 hover:bg-neutral-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl transition-all duration-200 active:scale-95"
                >
                  {t('View More Images', 'अधिक चित्र देखें', 'കൂടുതൽ ചിത്രങ്ങൾ')}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Instagram-style CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
           <h2 className="text-3xl font-bold text-primary mb-4">{t('Follow Our Story', 'हमारी कहानी का अनुसरण करें')}</h2>
           <p className="text-gray-400 mb-8">{t('Tag us in your photos to be featured on our social wall.', 'विशेष रूप से प्रदर्शित होने के लिए अपनी तस्वीरों में हमें टैग करें।')}</p>
           <div className="flex justify-center gap-6">
              <span className="text-xl font-black text-secondary">#LakeBreezeResorts</span>
              <span className="text-xl font-black text-secondary">#KeralaBackwaters</span>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
