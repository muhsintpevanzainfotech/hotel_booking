import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Search } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(9);
  const { t } = useLanguage();

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

  const fallbackImages = ['/hero_bright.png', '/room_deluxe.png', '/room_family.png', '/room1.jpg', '/hero_bright.png', '/room_deluxe.png', '/room_family.png', '/room1.jpg', '/hero_bright.png'];

  const displayItems = items.length > 0 ? items.slice(0, displayLimit) : fallbackImages.slice(0, displayLimit);
  const hasMore = items.length > displayLimit || (items.length === 0 && fallbackImages.length > displayLimit);

  return (
    <div className="bg-[#F8FAFA] min-h-screen">
      {/* Page Header */}
      <section className="bg-[#0F4C4C] text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-4 opacity-60">
             <ImageIcon size={20} />
             <span className="text-xs font-bold uppercase tracking-[0.3em]">{t('Visual Journey', 'दृश्य यात्रा')}</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">{t('Photo Gallery', 'फोटो गैलरी')}</h1>
          <p className="text-teal-100 text-lg max-w-xl">{t('Explore the serene beauty and architectural elegance of Lake Breeze Resorts through our lens.', 'हमारे लेंस के माध्यम से लेक ब्रीज रिसॉर्ट्स की शांत सुंदरता और वास्तुशिल्प लालित्य का अन्वेषण करें।')}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayItems.map((item, i) => {
                const isString = typeof item === 'string';
                const imgSrc = isString ? item : `${import.meta.env.VITE_SERVER_URL}/${item.image}`;
                
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

            {hasMore && (
              <div className="flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  className="px-12 py-5 bg-[#0F4C4C] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-teal-700 hover:scale-105 active:scale-95 transition-all"
                >
                  {t('View More Images', 'अधिक चित्र देखें')}
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
