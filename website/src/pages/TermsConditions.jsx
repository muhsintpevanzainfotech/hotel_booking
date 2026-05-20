import React from 'react';
import { motion } from 'framer-motion';
import { Scale, CheckCircle2, AlertCircle, Clock, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const TermsConditions = () => {
    const { t } = useLanguage();

    const terms = [
        {
            title: t('Booking & Reservation', 'बुकिंग और आरक्षण'),
            icon: <Clock size={24} />,
            content: t('By making a reservation, you enter into a direct binding agreement with Lake Breeze Resorts. All bookings are subject to availability and confirmation.', 'आरक्षण करके, आप लेक ब्रीज रिसॉर्ट्स के साथ सीधे बाध्यकारी समझौते में प्रवेश करते हैं। सभी बुकिंग उपलब्धता और पुष्टि के अधीन हैं।')
        },
        {
            title: t('Cancellation Policy', 'रद्दीकरण नीति'),
            icon: <AlertCircle size={24} />,
            content: t('Cancellations made 48 hours before check-in are eligible for a full refund. Late cancellations may incur a fee equivalent to one night stay.', 'चेक-इन से 48 घंटे पहले किए गए रद्दीकरण पूर्ण धनवापसी के पात्र हैं। देर से रद्दीकरण पर एक रात के प्रवास के बराबर शुल्क लग सकता है।')
        },
        {
            title: t('Guest Responsibility', 'अतिथि की जिम्मेदारी'),
            icon: <CheckCircle2 size={24} />,
            content: t('Guests are responsible for any damage to resort property during their stay and are expected to follow our code of conduct for a peaceful environment.', 'अतिथि अपने प्रवास के दौरान रिसॉर्ट की संपत्ति को होने वाले किसी भी नुकसान के लिए जिम्मेदार हैं और उनसे शांतिपूर्ण वातावरण के लिए हमारी आचार संहिता का पालन करने की अपेक्षा की जाती है।')
        }
    ];

    return (
        <div className="bg-[#F8FAFA] min-h-screen font-poppins pb-20">
            {/* Header */}
            <section className="bg-[#0F4C4C] text-white py-32 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-800 rounded-full translate-y-1/2 -translate-x-1/2 opacity-20 blur-3xl"></div>
                <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-8 backdrop-blur-xl border border-white/10">
                            <Scale size={40} className="text-teal-400" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">{t('Terms & Conditions', 'नियम और शर्तें')}</h1>
                        <p className="text-teal-100 text-lg opacity-80 max-w-2xl mx-auto">{t('Please read our terms carefully to ensure a smooth and delightful experience during your stay with us.', 'हमारे साथ अपने प्रवास के दौरान एक सहज और आनंदमय अनुभव सुनिश्चित करने के लिए कृपया हमारे नियमों को ध्यान से पढ़ें।')}</p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-[800px] mx-auto px-6 -mt-20 relative z-20">
                <div className="bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] p-12 md:p-20 border border-gray-50">
                    <div className="space-y-16">
                        {terms.map((term, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-[#F8FAFA] rounded-2xl flex items-center justify-center text-[#0F4C4C] group-hover:bg-[#0F4C4C] group-hover:text-white transition-all shadow-sm">
                                        {term.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#0F4C4C] tracking-tight">{term.title}</h2>
                                </div>
                                <p className="text-gray-500 leading-relaxed text-lg">
                                    {term.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 pt-12 border-t border-gray-100 text-center">
                        <p className="text-gray-400 text-sm mb-8">{t('Effective Date: January 1, 2026', 'प्रभावी तिथि: 1 जनवरी, 2026')}</p>
                        <Link to="/" className="inline-flex items-center gap-2 text-[#0F4C4C] font-black uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
                            <ChevronLeft size={16} />
                            {t('Back to Home', 'होम पर वापस जाएं')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsConditions;
