import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import useContact from '../../hooks/useContact';
import logoLandscape from '../../assets/LOGO LANDSCAPE.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { pathname } = useLocation();
  const { language, changeLanguage, t } = useLanguage();
  const { contact } = useContact();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [pathname]);

  const navItems = [
    { path: '/', label: t('Home', 'होम', 'ഹോം'), key: 'home' },
    { path: '/rooms', label: t('Rooms', 'कमरे', 'മുറികൾ'), key: 'rooms' },
    { path: '/facilities', label: t('Facilities', 'सुविधाएं', 'സൗകര്യങ്ങൾ'), key: 'facility' },
    { path: '/gallery', label: t('Gallery', 'गैलरी', 'ഗാലറി'), key: 'gallery' },
    { path: '/about', label: t('About Us', 'हमारे बारे में', 'ഞങ്ങളെക്കുറിച്ച്'), key: 'about' },
    { path: '/blog', label: t('Blog', 'ब्लॉग', 'ബ്ലോഗ്'), key: 'blog' },
    { path: '/contact', label: t('Contact Us', 'संपर्क', 'സമ്പർക്കം'), key: 'contact' }
  ];

  return (
    <div className="relative z-[1000]">
      {/* Topbar (Hidden on Scroll) */}
      <div className={`bg-[#0F4C4C] text-white transition-all duration-500 ${isSticky ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-12 opacity-100'}`}>
        <div className="max-w-[1200px] mx-auto px-6 h-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <div className="flex gap-8">
            <a href={`tel:${contact?.phone?.replace(/\s/g, '') || '+919876543210'}`} className="flex items-center gap-2 hover:text-teal-400 transition-colors">
              <Phone size={12} className="text-teal-400" /> 
              {contact?.phone || '+91 98765 43210'}
            </a>
            <a href={`mailto:${contact?.email || 'info@lakebreezeresort.com'}`} className="flex items-center gap-2 hidden md:flex hover:text-teal-400 transition-colors">
              <Mail size={12} className="text-teal-400" /> 
              {contact?.email || 'info@lakebreezeresort.com'}
            </a>
          </div>
          <div className="flex gap-8 items-center">
            {/* Language Selection in Topbar */}
            <div className="relative h-10 flex items-center" onMouseLeave={() => setLangOpen(false)}>
              <button 
                onClick={() => setLangOpen(!langOpen)}
                onMouseEnter={() => setLangOpen(true)}
                className="flex items-center gap-2 hover:text-teal-400 transition-colors cursor-pointer"
              >
                <Globe size={12} className="text-teal-400" />
                <span>{language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Malayalam'}</span>
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-0 w-32 bg-[#0F4C4C] border border-white/10 rounded-b-xl shadow-2xl z-[1100] py-2 overflow-hidden"
                  >
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'hi', label: 'Hindi' },
                      { code: 'ml', label: 'Malayalam' }
                    ].map((lang) => (
                      <button 
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-5 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer ${language === lang.code ? 'text-teal-400' : 'text-white/70'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <nav className={`w-full transition-all duration-500 sticky top-0 z-[1000] ${isSticky ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-white py-5'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center group py-1">
            <img 
              src={logoLandscape} 
              alt="Lake Breeze Resort" 
              className={`transition-all duration-500 w-auto object-contain max-w-[180px] sm:max-w-[220px] md:max-w-none ${
                isSticky ? 'h-8 md:h-10' : 'h-10 md:h-14'
              }`} 
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-6 lg:gap-10 text-[14px] tracking-wide">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link 
                    to={item.path} 
                    className={`transition-all duration-300 relative py-1.5 group ${
                      pathname === item.path 
                        ? 'text-[#0F4C4C] font-semibold' 
                        : 'text-neutral-500 hover:text-[#0F4C4C] font-normal'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-[#0F4C4C] rounded-full transition-all duration-300 ${
                      pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <Link to="/rooms" className={`btn-book-now text-[10px] ${isSticky ? 'px-6 py-2.5' : 'px-8 py-3'}`}>
                {t('Book Now', 'अभी बुक करें', 'ഇപ്പോൾ ബുക്ക് ചെയ്യുക')}
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-[#0F4C4C]"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-[2000] p-10 flex flex-col md:hidden">
          <div className="flex justify-between items-center mb-20">
             <img src={logoLandscape} alt="Logo" className="h-10 w-auto object-contain max-w-[200px]" />
             <button onClick={() => setMenuOpen(false)} className="p-2 bg-gray-50 rounded-full"><X size={32} /></button>
          </div>
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar">
             {navItems.map((item, i) => (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl tracking-wide py-2.5 border-b border-gray-100/80 transition-all duration-300 ${
                    pathname === item.path 
                      ? 'text-[#0F4C4C] font-semibold' 
                      : 'text-neutral-400 hover:text-[#0F4C4C] font-normal'
                  }`}
                >
                  {item.label}
                </Link>
             ))}
          </div>
          <div className="pt-10 space-y-6">
             <Link to="/rooms" onClick={() => setMenuOpen(false)} className="btn-book-now w-full py-4 text-base flex items-center justify-center gap-3">
               {t('Book Your Stay', 'अभी बुक करें', 'ഇപ്പോൾ ബുക്ക് ചെയ്യുക')}
             </Link>
             <div className="grid grid-cols-3 gap-4">
                {[
                  { code: 'en', label: 'EN' },
                  { code: 'hi', label: 'HI' },
                  { code: 'ml', label: 'ML' }
                ].map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setMenuOpen(false);
                    }}
                    className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${language === lang.code ? 'bg-[#0F4C4C] text-white border-[#0F4C4C]' : 'border-gray-100 text-gray-400'}`}
                  >
                    {lang.label}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
