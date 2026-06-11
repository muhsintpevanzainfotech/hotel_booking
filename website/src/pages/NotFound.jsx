import React from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, PhoneCall, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import useSEO from '../hooks/useSEO';

const NotFound = () => {
  const { t } = useLanguage();

  useSEO(
    t('404 Page Not Found', '404 पृष्ठ नहीं मिला'),
    t('The page you are looking for does not exist or has been moved.', 'आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है।')
  );

  return (
    <div className="bg-[#F8FAFA] min-h-[70vh] flex items-center justify-center font-poppins px-6 py-20 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#B8860B]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        {/* Animated Icon / Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 rounded-[32px] bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0F4C4C] relative shadow-lg">
            <HelpCircle size={48} className="text-[#0F4C4C] animate-pulse" />
            <div className="absolute inset-0 bg-[#0F4C4C]/5 rounded-[32px] blur-xl animate-ping opacity-40 pointer-events-none" />
          </div>
        </motion.div>

        {/* 404 Title */}
        <div className="space-y-3">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-7xl sm:text-9xl font-black tracking-tighter text-[#0F4C4C] select-none"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl sm:text-2xl font-black tracking-tight text-[#0f4c4c]"
          >
            {t('Lost in Paradise?', 'क्या आप स्वर्ग में खो गए हैं?', 'നിങ്ങൾ വഴിതെറ്റിയോ?')}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-md mx-auto"
          >
            {t(
              'The architectural sanctuary or luxury page you requested cannot be discovered. It might have been relocated or removed.',
              'आपके द्वारा अनुरोधित वास्तुशिल्प अभयारण्य या विलासिता पृष्ठ नहीं मिला। इसे स्थानांतरित या हटाया जा सकता है।',
              'നിങ്ങൾ തിരയുന്ന പേജ് ഇവിടെ കാണുന്നില്ല. അത് മാറ്റപ്പെടുകയോ ഇല്ലാതാക്കുകയോ ചെയ്തിരിക്കാം.'
            )}
          </motion.p>
        </div>

        {/* Navigation Actions */}
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-4"
        >
          <Link
            to="/"
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#0F4C4C] hover:bg-teal-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home size={14} />
            {t('Return Home', 'होम पर वापस जाएं', 'ഹോമിലേക്ക് മടങ്ങുക')}
          </Link>
          <Link
            to="/rooms"
            className="flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-teal-50/50 text-[#0F4C4C] border border-gray-150 rounded-full font-black uppercase text-[10px] tracking-widest transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Compass size={14} />
            {t('Explore Rooms', 'कमरे देखें', 'മുറികൾ കാണുക')}
          </Link>
        </motion.div>

        {/* Footer Support Callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="pt-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
        >
          <Link to="/contact" className="hover:text-[#0F4C4C] transition-colors flex items-center justify-center gap-2">
            <PhoneCall size={12} />
            {t('Need assistance? Contact us', 'सहायता चाहिए? संपर्क करें')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
