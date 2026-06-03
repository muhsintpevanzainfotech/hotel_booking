import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronLeft, Gift, Tag, Calendar, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import sitoutImg from '../assets/images/sitout.jpeg';

const Offers = () => {
  const { t } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/offers`);
        if (res.ok) {
          const data = await res.json();
          setOffers(data);
        }
      } catch (error) {
        console.error("Failed to fetch offers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
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

      {/* Offers Grid */}
      <section className="max-w-[1200px] mx-auto px-6 -mt-16 relative z-20">
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
        ) : offers.length > 0 ? (
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
                {/* Accent Background Glow */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-125 transition-all duration-500 pointer-events-none">
                  <Zap size={140} className="text-[#0F4C4C]" />
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
                    className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest transition-all duration-200 active:scale-[0.98] shadow-md cursor-pointer text-center"
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
            <h3 className="text-2xl font-bold text-[#0F4C4C] mb-2">{t('No Offers Available', 'कोई ऑफर उपलब्ध नहीं है')}</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">{t('All our exclusive promos have been claimed. Check back soon for new special deals!', 'हमारे सभी विशेष प्रोमो पूरे हो चुके हैं। जल्द ही नए विशेष सौदों के लिए वापस आएं!')}</p>
          </div>
        )}

        <div className="mt-20 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-[#0F4C4C] font-black uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
            <ChevronLeft size={16} />
            {t('Back to Home', 'होम पर वापस जाएं')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Offers;
