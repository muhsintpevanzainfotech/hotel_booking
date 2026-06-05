import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import useSEO from '../hooks/useSEO';

const PrivacyPolicy = () => {
    const { t } = useLanguage();

    useSEO(
        t('Privacy Policy', 'गोपनीयता नीति', 'സ്വകാര്യതാ നയം'),
        t('Learn how Lake Breeze Resorts collects, protects, and manages your personal booking data.', 'जानें कि हम आपकी व्यक्तिगत जानकारी की सुरक्षा कैसे करते हैं।')
    );

    const sections = [
        {
            title: t('Information We Collect', 'जानकारी जो हम एकत्र करते हैं'),
            icon: <Eye size={24} />,
            content: t('We collect information you provide directly to us, such as when you create or modify your account, request a booking, or contact customer support.', 'हम वह जानकारी एकत्र करते हैं जो आप हमें सीधे प्रदान करते हैं, जैसे कि जब आप अपना खाता बनाते या संशोधित करते हैं, बुकिंग का अनुरोध करते हैं, या ग्राहक सहायता से संपर्क करते हैं।')
        },
        {
            title: t('How We Use Information', 'हम जानकारी का उपयोग कैसे करते हैं'),
            icon: <FileText size={24} />,
            content: t('We use the information we collect to provide, maintain, and improve our services, such as to process bookings and send related information.', 'हम अपनी सेवाओं को प्रदान करने, बनाए रखने और सुधारने के लिए एकत्र की गई जानकारी का उपयोग करते हैं, जैसे बुकिंग की प्रक्रिया करना और संबंधित जानकारी भेजना।')
        },
        {
            title: t('Data Security', 'डेटा सुरक्षा'),
            icon: <Lock size={24} />,
            content: t('We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access.', 'हम आपकी व्यक्तिगत जानकारी को नुकसान, चोरी, दुरुपयोग और अनधिकृत पहुंच से बचाने के लिए उचित उपाय करते हैं।')
        }
    ];

    return (
        <div className="bg-[#F8FAFA] min-h-screen font-poppins pb-20">
            {/* Header */}
            <section className="bg-[#0F4C4C] text-white py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-3xl"></div>
                <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-8 backdrop-blur-xl border border-white/10">
                            <Shield size={40} className="text-teal-400" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">{t('Privacy Policy', 'गोपनीयता नीति')}</h1>
                        <p className="text-teal-100 text-lg opacity-80 max-w-2xl mx-auto">{t('Your trust is our most valuable asset. Learn how we protect and manage your data at Lake Breeze Resorts.', 'आपका विश्वास हमारी सबसे मूल्यवान संपत्ति है। जानें कि हम लेक ब्रीज रिसॉर्ट्स में आपके डेटा की सुरक्षा और प्रबंधन कैसे करते हैं।')}</p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-[800px] mx-auto px-6 -mt-20 relative z-20">
                <div className="bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] p-12 md:p-20 border border-gray-50">
                    <div className="space-y-16">
                        {sections.map((section, i) => (
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
                                        {section.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#0F4C4C] tracking-tight">{section.title}</h2>
                                </div>
                                <p className="text-gray-500 leading-relaxed text-lg">
                                    {section.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 pt-12 border-t border-gray-100 text-center">
                        <p className="text-gray-400 text-sm mb-8">{t('Last Updated: January 2026', 'अंतिम अपडेट: जनवरी 2026')}</p>
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

export default PrivacyPolicy;
