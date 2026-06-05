import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Waves, Wind, Coffee, Utensils, Wifi, Car, Camera, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../utils/imageHelper';
import useSEO from '../hooks/useSEO';
import bathroomImg from '../assets/images/bathroom.jpeg';
import coupleImg from '../assets/images/couple.jpeg';
import familyImg from '../assets/images/family.jpeg';
import familyroomImg from '../assets/images/familyroom.jpeg';
import masterImg from '../assets/images/master.jpeg';
import masterbedroomImg from '../assets/images/masterbedroom.jpeg';
import roomImg from '../assets/images/room.jpeg';
import roomsImg from '../assets/images/rooms.jpeg';
import sitoutImg from '../assets/images/sitout.jpeg';

const Facilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useSEO(
        t('Luxury Facilities & Amenities', 'शानदार सुविधाएं', 'സൗകര്യങ്ങൾ'),
        t('Explore the world-class facilities at Lake Breeze Resorts: infinity pool, fine dining, traditional spa, water sports, and high-speed Wi-Fi.', 'लेक ब्रीज रिसॉर्ट्स की शानदार सुविधाओं की सूची देखें: स्विमिंग पूल, स्पा और बहुत कुछ।')
    );

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
            image: roomsImg
        },
        { 
            title: t('Lakeside Dining', 'लेकसाइड डाइनिंग'), 
            description: t('Authentic Kerala cuisine under the stars.', 'तारों के नीचे प्रामाणिक केरल व्यंजन।'),
            image: roomImg
        },
        { 
            title: t('Ayurvedic Spa', 'आयुर्वेदिक स्पा'), 
            description: t('Traditional healing and relaxation.', 'पारंपरिक उपचार और विश्राम।'),
            image: familyroomImg
        },
        { 
            title: t('High-Speed WiFi', 'हाई-स्पीड वाईफाई'), 
            description: t('Stay connected even in nature.', 'प्रकृति में भी जुड़े रहें।'),
            image: masterbedroomImg
        },
        { 
            title: t('Travel Desk', 'ट्रैवल डेस्क'), 
            description: t('Curated local tours and transport.', 'क्यूरेटेड स्थानीय परिवहन।'),
            image: sitoutImg
        },
        { 
            title: t('Photography', 'फोटोग्राफी'), 
            description: t('Capture the beauty of Kumarakom.', 'कुमारकोम की सुंदरता को कैद करें।'),
            image: bathroomImg
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
            <section className="px-4 py-4 md:px-8 md:py-6 bg-[#0A3333] w-full max-w-[1400px] mx-auto">
              <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col justify-center items-center text-center shadow-md border border-white/5">
                {/* Background image & Overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img
                    src={familyImg}
                    alt="Facilities Banner"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  {/* Dark green gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/90 via-[#0F4C4C]/80 to-teal-900/60 backdrop-blur-[1px]" />
                </div>
                
                {/* Header Text Content */}
                <div className="relative z-10 text-white space-y-3 px-4 sm:px-6">
                  <div className="flex items-center justify-center gap-2 text-teal-300 opacity-80">
                    <Sparkles size={16} className="text-teal-300" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">{t('Exquisite Amenities', 'उत्कृष्ट सुविधाएं', 'അത്യാധുനിക സൗകര്യങ്ങൾ')}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
                    {t('Resort Facilities', 'रिसॉर्ट सुविधाएं', 'റിസോർട്ട് സൗകര്യങ്ങൾ')}
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-teal-200">
                    <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम', 'ഹോം')}</Link>
                    <span>•</span>
                    <span className="text-white">{t('Facilities', 'सुविधाएं', 'സൗകര്യങ്ങൾ')}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Alternating Facilities Section */}
            <section className="pb-32 px-6">
                <div className="max-w-[1200px] mx-auto space-y-32">
                    {displayFacilities.map((fac, i) => {
                        const isEven = i % 2 === 0;
                        const IconComponent = IconMap[fac.icon?.toLowerCase()] || Sparkles;
                        const mainImg = getImageUrl(fac.coverImage || fac.image);
                        const iconImg = fac.coverImage && fac.image ? getImageUrl(fac.image) : null;

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
                        className="inline-flex items-center justify-between gap-6 bg-neutral-950 hover:bg-neutral-900 text-white pl-8 pr-2 py-2 rounded-full w-fit shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold uppercase tracking-widest text-[10px] group mx-auto"
                    >
                        <span>{t('Reserve Your Stay', 'अपना प्रवास सुरक्षित करें', 'താമസം ബുക്ക് ചെയ്യുക')}</span>
                        <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                            <ArrowRight size={14} className="stroke-[3]" />
                        </span>
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Facilities;
