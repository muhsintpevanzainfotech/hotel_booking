import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Waves, Wind, Coffee, Utensils, Wifi, Car, Camera, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Facilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE}/facilities`);
                if (response.ok) {
                    const data = await response.json();
                    setFacilities(data);
                }
            } catch (error) {
                console.error("Failed to fetch facilities", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFacilities();
    }, []);

    const defaultFacilities = [
        { 
            title: t('Infinity Pool', 'इन्फिनिटी पूल'), 
            description: t('Swim with a view of the backwaters.', 'बैकवाटर्स के दृश्य के साथ तैरें।'),
            image: '/hero_bright.png'
        },
        { 
            title: t('Lakeside Dining', 'लेकसाइड डाइनिंग'), 
            description: t('Authentic Kerala cuisine under the stars.', 'तारों के नीचे प्रामाणिक केरल व्यंजन।'),
            image: '/room_deluxe.png'
        },
        { 
            title: t('Ayurvedic Spa', 'आयुर्वेदिक स्पा'), 
            description: t('Traditional healing and relaxation.', 'पारंपरिक उपचार और विश्राम।'),
            image: '/room_family.png'
        },
        { 
            title: t('High-Speed WiFi', 'हाई-स्पीड वाईफाई'), 
            description: t('Stay connected even in nature.', 'प्रकृति में भी जुड़े रहें।'),
            image: '/room1.jpg'
        },
        { 
            title: t('Travel Desk', 'ट्रैवल डेस्क'), 
            description: t('Curated local tours and transport.', 'क्यूरेटेड स्थानीय परिवहन।'),
            image: '/hero_bright.png'
        },
        { 
            title: t('Photography', 'फोटोग्राफी'), 
            description: t('Capture the beauty of Kumarakom.', 'कुमारकोम की सुंदरता को कैद करें।'),
            image: '/room_deluxe.png'
        }
    ];

    const displayFacilities = facilities.length > 0 ? facilities : defaultFacilities;

    const IconMap = {
        pool: Waves,
        waves: Waves,
        wind: Wind,
        coffee: Coffee,
        utensils: Utensils,
        dining: Utensils,
        wifi: Wifi,
        car: Car,
        transport: Car,
        camera: Camera,
        photography: Camera,
        map: MapPin,
        location: MapPin,
        sparkles: Sparkles
    };

    return (
        <div className="bg-[#0A3333] min-h-screen font-poppins">
            {/* Page Header */}
            <header className="py-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-900/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-[1200px] mx-auto relative z-10 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.5em]">{t('Exquisite Amenities', 'उत्कृष्ट सुविधाएं')}</span>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{t('Resort Facilities', 'रिसॉर्ट सुविधाएं')}</h1>
                        <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>
                    </motion.div>
                </div>
            </header>

            {/* Alternating Facilities Section */}
            <section className="pb-32 px-6">
                <div className="max-w-[1200px] mx-auto space-y-32">
                    {displayFacilities.map((fac, i) => {
                        const isEven = i % 2 === 0;
                        const IconComponent = IconMap[fac.icon?.toLowerCase()] || Sparkles;
                        const mainImg = fac.coverImage ? `${import.meta.env.VITE_SERVER_URL}/${fac.coverImage}` : fac.image?.startsWith('/') ? fac.image : `${import.meta.env.VITE_SERVER_URL}/${fac.image}`;
                        const iconImg = fac.image && !fac.image.startsWith('/') ? `${import.meta.env.VITE_SERVER_URL}/${fac.image}` : null;

                        return (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
                            >
                                {/* Image Column */}
                                <div className="w-full lg:w-1/2">
                                    <div className="relative group">
                                        <div className="relative z-10 rounded-[32px] overflow-hidden shadow-2xl border border-white/5 aspect-[4/3]">
                                            <img 
                                                src={mainImg} 
                                                alt={fac.title} 
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A3333]/60 to-transparent"></div>
                                            
                                            {/* Icon Overlay (Bottom Corner) */}
                                            <div className={`absolute bottom-6 ${isEven ? 'right-6' : 'left-6'} z-20`}>
                                                {iconImg ? (
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl backdrop-blur-md bg-white/10 p-1">
                                                        <img src={iconImg} alt="icon" className="w-full h-full object-cover rounded-xl" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-white shadow-2xl">
                                                        <IconComponent size={28} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Decorative Background Element */}
                                        <div className={`absolute -inset-4 bg-teal-500/10 blur-3xl -z-10 rounded-full transition-opacity opacity-0 group-hover:opacity-100`}></div>
                                    </div>
                                </div>

                                {/* Text Column */}
                                <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                        {fac.title}
                                    </h2>
                                    <div className={`w-12 h-1 bg-teal-500 rounded-full mx-auto ${isEven ? 'lg:ml-0' : 'lg:mr-0'}`}></div>
                                    <p className="text-teal-100/60 text-lg leading-relaxed font-medium">
                                        {fac.description || fac.content}
                                    </p>
                                    <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 justify-center ${isEven ? 'lg:justify-start' : 'lg:justify-end'}`}>
                                        <Sparkles size={14} />
                                        <span>Premium Guest Experience</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-[#082a2a]">
                <div className="max-w-[1200px] mx-auto text-center space-y-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        {t('Begin Your Journey', 'अपनी यात्रा शुरू करें')}
                    </h2>
                    <p className="text-teal-100/40 text-xl max-w-2xl mx-auto">
                        {t('Every corner of Lake Breeze is designed to provide an atmosphere of tranquility and refined luxury.', 'लेक ब्रीज का हर कोना शांति और परिष्कृत विलासिता का वातावरण प्रदान करने के लिए डिज़ाइन किया गया है।')}
                    </p>
                    <button 
                        onClick={() => window.location.href = '/rooms'}
                        className="px-12 py-6 bg-teal-500 text-[#0A3333] rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-teal-400 hover:scale-105 active:scale-95 transition-all"
                    >
                        {t('Reserve Your Stay', 'अपना प्रवास सुरक्षित करें')}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Facilities;
