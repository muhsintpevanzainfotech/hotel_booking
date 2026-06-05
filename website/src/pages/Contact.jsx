import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, Send, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import useContact from '../hooks/useContact';
import useSEO from '../hooks/useSEO';
import sitoutImg from '../assets/images/sitout.jpeg';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const { t } = useLanguage();
  const { contact } = useContact();

  useSEO(
    t('Contact & Directions', 'हमसे संपर्क करें', 'ബന്ധപ്പെടുക'),
    t('Get in touch with the Lake Breeze Resorts concierge desk. Find locations, map directions, email and phone numbers.', 'हमसे संपर्क करें। लेक ब्रीज रिसॉर्ट्स के पते, फोन नंबर और ईमेल की जानकारी प्राप्त करें।')
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  const contactInfo = [
    { 
      icon: <MapPin size={24} />, 
      title: t('Our Address', 'हमारा पता'), 
      content: contact?.address || 'Kumarakom, Kottayam, Kerala - 686563',
      link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact?.address || 'Lake Breeze Resort Kumarakom Kerala')}`
    },
    { 
      icon: <PhoneCall size={24} />, 
      title: t('Call Us', 'हमें कॉल करें'), 
      content: contact?.phone || '+91 98765 43210',
      link: `tel:${(contact?.phone || '+919876543210').replace(/\s/g, '')}`
    },
    { 
      icon: <Mail size={24} />, 
      title: t('Email Us', 'हमें ईमेल करें'), 
      content: contact?.email || 'info@lakebreezeresort.com',
      link: `mailto:${contact?.email || 'info@lakebreezeresort.com'}`
    }
  ];

  return (
    <div className="bg-[#F8FAFA] min-h-screen font-poppins">
      {/* Page Header */}
      <section className="px-4 py-4 md:px-8 md:py-6 bg-white w-full max-w-[1400px] mx-auto">
        <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col justify-center items-center text-center shadow-md">
          {/* Background image & Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={sitoutImg}
              alt="Contact Us Banner"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Dark green gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/90 via-[#0F4C4C]/80 to-teal-900/60 backdrop-blur-[1px]" />
          </div>
          
          {/* Header Text Content */}
          <div className="relative z-10 text-white space-y-3 px-4 sm:px-6">
            <div className="flex items-center justify-center gap-2 text-teal-300 opacity-80">
              <MessageSquare size={16} className="text-teal-300" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">{t('Get in Touch', 'संपर्क करें', 'ബന്ധപ്പെടുക')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
              {t('Contact Us', 'हमसे जुड़ें', 'ബന്ധപ്പെടുക')}
            </h1>
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-teal-200">
              <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम', 'ഹോം')}</Link>
              <span>•</span>
              <span className="text-white">{t('Contact', 'संपर्क', 'സമ്പർക്കം')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-bold text-[#0F4C4C] mb-12 tracking-tight">{t('Reach Our Estate', 'हम तक कैसे पहुँचें')}</h2>
            <div className="space-y-10 mb-16">
              {contactInfo.map((item, i) => (
                <a 
                  key={i} 
                  href={item.link}
                  target={item.title === t('Our Address', 'हमारा पता') ? "_blank" : undefined}
                  rel={item.title === t('Our Address', 'हमारा पता') ? "noopener noreferrer" : undefined}
                  className="flex gap-6 items-start group cursor-pointer"
                >
                  <div className="w-14 h-14 bg-white shadow-sm text-[#0F4C4C] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#0F4C4C] group-hover:text-white transition-all border border-gray-100">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-gray-400 mb-2">{item.title}</h4>
                    <p className="text-lg font-bold text-[#0F4C4C] group-hover:text-teal-600 transition-colors">{item.content}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-[#0F4C4C] p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
               <h4 className="text-2xl font-bold mb-4 tracking-tight">{t('WhatsApp Support', 'व्हाट्सएप सहायता')}</h4>
               <p className="text-teal-100/70 mb-8 leading-relaxed font-medium">{t('For faster response, chat with our local concierge team directly on WhatsApp.', 'तेजी से प्रतिक्रिया के लिए, व्हाट्सएप पर हमारी टीम के साथ सीधे चैट करें।')}</p>
               <a 
                  href={`https://wa.me/${(contact?.phone || '919876543210').replace(/\D/g, '')}`} 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl hover:bg-[#20ba5a] active:scale-95 transition-all"
               >
                  <PhoneCall size={18} />
                  {t('WhatsApp Us', 'व्हाट्सएप करें')}
               </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 md:p-16 rounded-[40px] shadow-sm border border-gray-100"
          >
            <h3 className="text-3xl font-bold text-[#0F4C4C] mb-10 tracking-tight">{t('Send a Message', 'संदेश भेजें')}</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              {status.success && (
                <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-100 text-sm font-bold animate-in fade-in zoom-in">
                  {t('Thank you! Your message has been sent successfully.', 'धन्यवाद! आपका संदेश सफलतापूर्वक भेज दिया गया है।')}
                </div>
              )}
              {status.error && (
                <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-sm font-bold">
                  {t('Error:', 'त्रुटि:')} {status.error}
                </div>
              )}
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Full Name', 'पूरा नाम')}</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Email Address', 'ईमेल पता')}</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Your Message', 'आपका संदेश')}</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder={t('How can we help you plan your stay?', 'हम आपकी किस प्रकार सहायता कर सकते हैं?')}
                  rows="5"
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status.loading}
                className="w-full bg-neutral-950 hover:bg-neutral-900 text-white py-5 rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {status.loading ? t('Sending...', 'भेजा जा रहा है...') : t('Send Message', 'संदेश भेजें')}
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <div className="mt-20 h-[500px] w-full rounded-[48px] overflow-hidden shadow-2xl border-8 border-white relative group">
          <iframe 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(contact?.address || 'Lake Breeze Resort Kumarakom Kerala')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            className="transition-all duration-700 grayscale group-hover:grayscale-0"
          ></iframe>
          <div className="absolute inset-0 bg-[#0F4C4C]/20 pointer-events-none group-hover:bg-transparent transition-all duration-700"></div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
