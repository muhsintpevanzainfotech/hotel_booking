import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronLeft, Gift, Tag, Copy, Check } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import useSEO from '../hooks/useSEO';
import sitoutImg from '../assets/images/sitout.jpeg';
import { getImageUrl } from '../utils/imageHelper';
import logoLandscape from '../assets/LOGO LANDSCAPE.png';
import ComboBookingModal from '../components/rooms/ComboBookingModal';

const Offers = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [comboOffers, setComboOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('promos'); // 'promos' or 'combos'
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setActiveTab(params.get('tab') === 'combos' ? 'combos' : 'promos');
  }, [location]);

  useSEO(
    t('Exclusive Offers & Campaigns', 'विशेष ऑफर', 'പ്രത്യേക ഓഫറുകൾ'),
    t('Discover seasonal deals, early bird savings, discount vouchers, and direct booking campaigns for Lake Breeze Resorts.', 'लेक ब्रीज रिसॉर्ट्स के विशेष ऑफर्स और डिस्काउंट वाउचर्स की जानकारी प्राप्त करें।')
  );

  useEffect(() => {
    const fetchAllOffers = async () => {
      try {
        const [offRes, comboRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE}/offers`),
          fetch(`${import.meta.env.VITE_API_BASE}/combo-offers`)
        ]);
        if (offRes.ok) {
          setOffers(await offRes.json());
        }
        if (comboRes.ok) {
          setComboOffers(await comboRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch offers data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOffers();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(t('Promo code copied!', 'प्रोमो कोड कॉपी किया गया!'));
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="bg-[#F8FAFA] min-h-screen font-poppins pb-24">
      {/* Page Header */}
      <section className="px-4 py-4 md:px-8 md:py-6 bg-white w-full max-w-[1400px] mx-auto">
        <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col justify-center items-center text-center shadow-md">
          {/* Background image & Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={sitoutImg}
              alt="Offers Banner"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Dark green gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/90 via-[#0F4C4C]/80 to-teal-900/60 backdrop-blur-[1px]" />
          </div>
          
          {/* Header Text Content */}
          <div className="relative z-10 text-white space-y-3 px-4 sm:px-6">
            <div className="flex items-center justify-center gap-2 text-teal-300 opacity-80">
              <Gift size={16} className="text-teal-300" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">{t('Exclusive Offers', 'विशेष ऑफर', 'പ്രത്യേക ഓഫറുകൾ')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
              {t('Exclusive Offers', 'विशेष ऑफर', 'പ്രത്യേക ഓഫറുകൾ')}
            </h1>
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-teal-200">
              <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम', 'ഹോം')}</Link>
              <span>•</span>
              <span className="text-white">{t('Offers', 'ऑफर', 'ഓഫറുകൾ')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Offers & Packages Navigation Section */}
      <section className="max-w-[1200px] mx-auto px-6 -mt-16 relative z-20">
        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('promos')}
            className={`px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
              activeTab === 'promos'
                ? 'bg-neutral-950 text-white shadow-neutral-950/20'
                : 'bg-white text-gray-800 hover:bg-teal-50/50 border border-gray-100'
            }`}
          >
            {t('Promo Vouchers', 'प्रोमो वाउचर')} ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('combos')}
            className={`px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
              activeTab === 'combos'
                ? 'bg-neutral-950 text-white shadow-neutral-950/20'
                : 'bg-white text-gray-800 hover:bg-teal-50/50 border border-gray-100'
            }`}
          >
            {t('Combo Packages', 'कॉम्बो पैकेज')} ({comboOffers.length})
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[40px] p-10 border border-gray-100 h-96 shadow-sm animate-pulse flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl mb-8"></div>
                  <div className="h-6 bg-gray-100 rounded-lg w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-100 rounded-lg w-1/2 mb-6"></div>
                  <div className="h-4 bg-gray-100 rounded-lg w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded-lg w-5/6"></div>
                </div>
                <div className="h-12 bg-gray-100 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        ) : activeTab === 'promos' ? (
          offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer, i) => (
                <motion.div
                  key={offer._id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-[40px] border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:border-teal-100 transition-all duration-300 p-10 flex flex-col justify-between relative overflow-hidden group h-[400px]"
                >
                  <div className="absolute inset-y-0 right-0 w-24 opacity-[0.03] group-hover:opacity-10 group-hover:scale-125 transition-all duration-500 pointer-events-none">
                    <Zap size={140} className="text-[#0F4C4C] absolute top-10 right-4" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0F4C4C] group-hover:bg-[#0F4C4C] group-hover:text-white transition-colors duration-300 shadow-sm">
                        <Zap size={20} />
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-[#0F4C4C] rounded-full text-[9px] font-black uppercase tracking-wider">
                        <Tag size={10} />
                        {t('Promo Deal', 'प्रोमो डील')}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-[#0F4C4C] mb-2 leading-tight tracking-tight group-hover:text-teal-800 transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-4xl font-black text-teal-600 mb-6 tracking-tighter">
                      {offer.discount}
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                      {offer.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-50 mt-6 flex flex-col gap-4">
                    {offer.code && (
                      <div className="flex items-center justify-between bg-[#F8FAFA] px-5 py-3 rounded-2xl border border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{t('Promo Code', 'प्रोमो कोड')}</span>
                          <span className="text-xs font-black text-[#0F4C4C] tracking-widest">{offer.code}</span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(offer.code)}
                          className="text-[#0F4C4C] hover:text-teal-600 p-1.5 rounded-lg hover:bg-white transition-all cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === offer.code ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => window.location.href = `/rooms?code=${offer.code}`}
                      className="w-full h-10 rounded-full bg-white border border-[#0F4C4C]/40 text-[#0F4C4C] font-semibold uppercase text-[9px] tracking-widest hover:-translate-y-0.5 hover:shadow-md hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880] transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
                    >
                      {t('Book with Offer', 'ऑफर के साथ बुक करें', 'ഓഫറോടെ ബുക്ക് ചെയ്യുക')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-16 text-center">
              <Gift size={48} className="mx-auto text-teal-600 opacity-20 mb-6" />
              <h3 className="text-2xl font-bold text-[#0F4C4C] mb-2">{t('No Vouchers Available', 'कोई प्रोमो उपलब्ध नहीं है')}</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto">{t('All our exclusive promos have been claimed. Check back soon for new special deals!', 'हमारे सभी विशेष प्रोमो पूरे हो चुके हैं। जल्द ही नए विशेष सौदों के लिए वापस आएं!')}</p>
            </div>
          )
        ) : (
          comboOffers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {comboOffers.map((combo, i) => {
                const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
                const slug = slugify(combo.title);
                return (
                  <motion.div
                    key={combo._id || i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    onClick={() => navigate(`/packages/${slug}`)}
                    className="bg-white rounded-[32px] border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:border-teal-100 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group min-h-[300px] sm:h-[350px] cursor-pointer"
                  >
                    {/* Left Side: Image / Logo Fallback */}
                    <div className="relative w-full sm:w-[42%] min-h-[180px] sm:min-h-full overflow-hidden shrink-0">
                      {combo.coverImage ? (
                        <img 
                          src={getImageUrl(combo.coverImage)} 
                          alt={combo.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#FAF6F0] flex items-center justify-center p-8 select-none">
                          <img 
                            src={logoLandscape} 
                            alt="Lake Breeze Resort Logo" 
                            className="h-10 w-auto object-contain opacity-60" 
                          />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/50 sm:from-transparent to-transparent pointer-events-none" />
                      
                      {/* Floating type badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F4C4C] text-white rounded-full text-[9px] font-black uppercase tracking-wider">
                          {combo.type}
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <h3 className="text-lg md:text-xl font-black text-[#0F4C4C] leading-tight tracking-tight group-hover:text-teal-800 transition-colors line-clamp-2">
                            {combo.title}
                          </h3>
                          <span className="shrink-0 text-base sm:text-lg font-black text-white bg-[#0F4C4C] px-3.5 py-1 rounded-xl shadow-md self-start">
                            ₹{combo.price.toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-550 text-xs leading-relaxed line-clamp-2">
                          {combo.description}
                        </p>

                        {/* Includes tags */}
                        {combo.includes && combo.includes.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{t('Includes:', 'शामिल है:')}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {combo.includes.slice(0, 3).map((inc, index) => (
                                <span key={index} className="px-2 py-0.5 bg-teal-50 text-[#0F4C4C] text-[8.5px] font-bold rounded-lg border border-teal-100/30 uppercase tracking-wider">
                                  {inc}
                                </span>
                              ))}
                              {combo.includes.length > 3 && (
                                <span className="px-2 py-0.5 bg-neutral-50 text-gray-400 text-[8.5px] font-bold rounded-lg border border-gray-100 uppercase tracking-wider">
                                  +{combo.includes.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Book & View Details Buttons */}
                      <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/packages/${slug}`);
                          }}
                          className="w-full sm:w-[140px] h-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#C5A880] hover:border-[#C5A880] font-semibold uppercase text-[9px] tracking-wider hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
                        >
                          {t('View Details', 'विवरण देखें')}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/packages/${slug}`);
                          }}
                          className="w-full sm:w-[140px] h-11 rounded-full bg-white border border-[#0F4C4C]/40 text-[#0F4C4C] font-semibold uppercase text-[9px] tracking-wider hover:-translate-y-0.5 hover:shadow-md hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880] transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center"
                        >
                          {t('Book Now', 'अभी बुक करें', 'ഇപ്പോൾ ബുക്ക് ചെയ്യുക')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-16 text-center">
              <Gift size={48} className="mx-auto text-teal-600 opacity-20 mb-6" />
              <h3 className="text-2xl font-bold text-[#0F4C4C] mb-2">{t('No Packages Available', 'कोई पैकेज उपलब्ध नहीं है')}</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto">{t('All our combo packages are currently sold out. Check back soon for new special package deals!', 'हमारे सभी कॉम्बो पैकेज वर्तमान में बिक चुके हैं। नए विशेष पैकेज सौदों के लिए जल्द ही वापस आएं!')}</p>
            </div>
          )
        )}

        <div className="mt-20 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-[#0F4C4C] font-semibold uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
            <ChevronLeft size={16} />
            {t('Back to Home', 'होम पर वापस जाएं')}
          </Link>
        </div>
      </section>
      {/* Combo Booking Modal */}
      <ComboBookingModal
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        combo={selectedCombo}
      />
    </div>
  );
};

export default Offers;
