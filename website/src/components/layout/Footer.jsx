import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Linkedin, Phone, Mail, MapPin, Award, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import useContact from '../../hooks/useContact';

const Footer = () => {
  const { t } = useLanguage();
  const { contact } = useContact();

  return (
    <footer className="bg-[#0a3333] text-white py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24">
          {/* Brand Col */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 group">
              <img src="/favicon.png" alt="Lake Breeze Logo" className="h-12 brightness-0 invert group-hover:scale-110 transition-transform" />
              <h4 className="text-3xl font-bold tracking-tighter">{t('Lake Breeze', 'लेक ब्रीज')}</h4>
            </div>
            <p className="text-teal-100/60 text-sm leading-relaxed font-medium max-w-xs">
              {t('Providing architectural sanctuaries where the horizon meets unrivaled luxury. Perfect for families and couples seeking peace.', 'एक वास्तुशिल्प अभयारण्य जहाँ क्षितिज बेजोड़ विलासिता से मिलता है।')}
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, key: 'instagram', label: 'Instagram' },
                { Icon: Facebook, key: 'facebook', label: 'Facebook' },
                { Icon: Twitter, key: 'twitter', label: 'X (Twitter)' },
                { Icon: Linkedin, key: 'linkedin', label: 'LinkedIn' }
              ].map(({ Icon, key, label }) => {
                const url = contact?.socialLinks?.[key];
                return (
                  <a
                    key={key}
                    href={url || '#'}
                    target={url ? '_blank' : undefined}
                    rel={url ? 'noopener noreferrer' : undefined}
                    title={label}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-100 hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-10">{t('Explore', 'अन्वेषण')}</h4>
            <ul className="space-y-5 text-sm font-bold text-teal-100/60 tracking-widest">
              {[
                { to: '/', label: t('Home', 'होम') },
                { to: '/rooms', label: t('Rooms', 'कमरे') },
                { to: '/facilities', label: t('Facilities', 'सुविधाएं') },
                { to: '/gallery', label: t('Gallery', 'गैलरी') },
                { to: '/blog', label: t('Blog', 'ब्लॉग') },
                { to: '/contact', label: t('Contact', 'संपर्क') },
                { to: '/about', label: t('About Us', 'हमारे बारे में') }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="hover:text-white transition-all flex items-center gap-3 group">
                    <Check size={14} className="text-teal-400/0 group-hover:text-teal-400 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-10">{t('Contact', 'संपर्क')}</h4>
            <ul className="space-y-8">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact?.address || 'Lake Breeze Resort Kumarakom Kerala')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-100/80 text-sm font-medium leading-relaxed hover:text-white transition-colors"
                >
                  {contact?.address || 'Kumarakom, Kottayam, Kerala - 686563'}
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 shrink-0">
                  <Phone size={18} />
                </div>
                <a href={`tel:${contact?.phone || '+919876543210'}`} className="text-teal-100/80 text-sm font-bold tracking-tight hover:text-white transition-colors">{contact?.phone || '+91 98765 43210'}</a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 shrink-0">
                  <Mail size={18} />
                </div>
                <a href={`mailto:${contact?.email || 'info@lakebreezeresort.com'}`} className="text-teal-100/80 text-sm font-bold tracking-tight hover:text-white transition-colors">{contact?.email || 'info@lakebreezeresort.com'}</a>
              </li>
            </ul>
          </div>

          {/* Support Col */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-10">{t('Legal & Support', 'कानूनी और सहायता')}</h4>
            <ul className="space-y-5 text-sm font-bold text-teal-100/60 tracking-widest">
              {[
                { to: '/booking-status', label: t('Check Booking', 'बुकिंग देखें') },
                { to: '/offers', label: t('Exclusive Offers', 'विशेष ऑफर') },
                { to: '/terms-conditions', label: t('Terms & Conditions', 'नियम और शर्तें') },
                { to: '/privacy-policy', label: t('Refund & Policy', 'धनवापसी और नीति') },
                { to: '/sitemap', label: t('Sitemap', 'साइटमैप') }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="hover:text-white transition-all flex items-center gap-3 group">
                    <Check size={14} className="text-teal-400/0 group-hover:text-teal-400 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <a href={`https://wa.me/${(contact?.phone || '919876543210').replace(/\D/g, '')}`} className="w-full h-14 bg-[#25D366] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-[#20ba5a] active:scale-95 transition-all">
                <Phone size={16} />
                {t('WhatsApp Reservation', 'व्हाट्सएप आरक्षण')}
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-teal-100/10">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="Lake Breeze Logo" className="h-8 brightness-0 invert" />
            <p>© 2026 Lake Breeze Resorts. {t('All Rights Reserved.', 'सर्वाधिकार सुरक्षित।')}</p>
          </div>
          <div className="flex gap-10">
            <Link to="/privacy-policy" className="hover:text-teal-400 transition-colors">{t('Privacy Policy', 'गोपनीयता नीति')}</Link>
            <Link to="/terms-conditions" className="hover:text-teal-400 transition-colors">{t('Terms & Conditions', 'नियम और शर्तें')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
