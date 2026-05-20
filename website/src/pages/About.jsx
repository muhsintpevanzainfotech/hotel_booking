import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Heart, History, Leaf, MapPin, Users, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const milestones = [
    { year: '1994', title: t('The Vision', 'दृष्टिकोण'), desc: t('Founded with just 4 traditional cottages.', 'सिर्फ 4 पारंपरिक कॉटेज के साथ स्थापना।') },
    { year: '2005', title: t('Expansion', 'विस्तार'), desc: t('Added the Infinity Pool and Ayurvedic Spa.', 'इन्फिनिटी पूल और आयुर्वेदिक स्पा जोड़ा गया।') },
    { year: '2015', title: t('Green Initiative', 'हरित पहल'), desc: t('Transitioned to 60% solar energy usage.', '60% सौर ऊर्जा उपयोग में परिवर्तित।') },
    { year: '2023', title: t('Excellence Award', 'उत्कृष्टता पुरस्कार'), desc: t('Voted #1 Resort in Kerala for three years.', 'तीन वर्षों के लिए केरल में #1 रिज़ॉर्ट चुना गया।') },
  ];

  return (
    <div className="bg-[#F8FAFA] min-h-screen">
      {/* Page Header */}
      <section className="bg-[#0F4C4C] text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-teal-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4 opacity-60"
          >
             <History size={20} />
             <span className="text-xs font-bold uppercase tracking-[0.3em]">{t('Our Heritage', 'हमारी विरासत')}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-tight"
          >
            {t('Defining Luxury Since 1994', '1994 से विलासिता को परिभाषित कर रहे हैं')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-teal-100 text-lg md:text-2xl max-w-2xl leading-relaxed"
          >
            {t('Lake Breeze Resorts was founded on the principle that true luxury is found in the intersection of nature and craftsmanship.', 'लेक ब्रीज रिसॉर्ट्स की स्थापना इस सिद्धांत पर की गई थी कि वास्तविक विलासिता प्रकृति और शिल्प कौशल के संगम में पाई जाती है।')}
          </motion.p>
        </div>
      </section>

      {/* Main Content - Our Story */}
      <section className="py-16 md:py-16 max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F4C4C] tracking-tight leading-tight">
              {t('A Legacy of Unrivaled Excellence', 'बेजोड़ उत्कृष्टता की विरासत')}
            </h2>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed">
              {t('For over three decades, we have served as a sanctuary for those who seek the extraordinary. Our Kerala retreat is more than a destination; it is a visual and sensory journal of moments refined by time. We do not just provide shelter; we curate a legacy of presence.', 'तीन दशकों से अधिक समय से, हमने उन लोगों के लिए एक अभयारण्य के रूप में सेवा की है जो असाधारण की तलाश करते हैं। हमारी केरल रिट्रीट सिर्फ एक गंतव्य से अधिक है; यह समय के साथ परिष्कृत क्षणों की एक दृश्य और संवेदी डायरी है। हम केवल आश्रय प्रदान नहीं करते हैं; हम उपस्थिति की एक विरासत को संजोते हैं।')}
            </p>
            <div className="p-8 md:p-10 bg-white rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#0F4C4C] group-hover:w-4 transition-all"></div>
              <p className="italic text-lg md:text-xl text-[#0F4C4C] font-medium leading-relaxed mb-6">
                "{t('The horizon is not a boundary, but a call to the extraordinary. We invite you to experience the true essence of Kumarakom.', 'क्षितिज एक सीमा नहीं है, बल्कि असाधारण के लिए एक आह्वान है। हम आपको कुमारकोम के वास्तविक सार का अनुभव करने के लिए आमंत्रित करते हैं।')}"
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-[1px] bg-gray-200"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Lake Breeze Founding Family</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="/kerala_architecture_resort_1778950177084.png" 
              alt="Our Heritage Architecture" 
              className="w-full h-[400px] md:h-[600px] object-cover rounded-[48px] shadow-2xl" 
            />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl -z-10"></div>
            
            <div className="hidden md:flex absolute bottom-10 -right-10 flex-col gap-6 bg-white p-10 rounded-[32px] shadow-2xl border border-gray-50">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 text-[#0F4C4C] rounded-xl flex items-center justify-center">
                    <History size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#0F4C4C] tracking-tighter">30+</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t('Years of Story', 'कहानी के वर्ष')}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 text-[#0F4C4C] rounded-xl flex items-center justify-center">
                    <Star size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#0F4C4C] tracking-tighter">4.9</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t('Guest Rating', 'अतिथि रेटिंग')}</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Architecture Section */}
      <section className="py-16 md:py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 order-2 md:order-1"
            >
              <img 
                src="/hero_bright.png" 
                alt="Architecture Details" 
                className="w-full h-[300px] md:h-[500px] object-cover rounded-[40px] shadow-xl"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 space-y-6 order-1 md:order-2"
            >
              <div className="flex items-center gap-3 opacity-60">
                <MapPin size={18} className="text-[#0F4C4C]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F4C4C]">{t('Authentic Design', 'प्रामाणिक डिजाइन')}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#0F4C4C]">
                {t('Crafted with Soul', 'आत्मा के साथ तैयार')}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {t('Our architecture is a tribute to the "Nalukettu" style of Kerala. Every beam of teakwood and every clay tile has been sourced locally to ensure that we breathe the same spirit as the land we sit upon. We believe in building spaces that do not just stand on the earth, but belong to it.', 'हमारी वास्तुकला केरल की "नालुकट्टु" शैली को एक श्रद्धांजलि है। टीकवुड का हर शहतीर और मिट्टी की हर टाइल स्थानीय रूप से प्राप्त की गई है ताकि यह सुनिश्चित हो सके कि हम उसी भावना को महसूस करें जिस भूमि पर हम बैठे हैं।')}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                 <div className="space-y-2">
                    <p className="text-[#0F4C4C] font-bold">100%</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('Local Materials', 'स्थानीय सामग्री')}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[#0F4C4C] font-bold">500+</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('Handmade Tiles', 'हाथ से बनी टाइलें')}</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sustainable Luxury Section */}
      <section className="py-16 md:py-16 bg-[#0F4C4C] text-white overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-teal-800/50 rounded-full border border-teal-700">
                <Leaf size={16} className="text-teal-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400">{t('Sustainability', 'स्थिरता')}</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                {t('Our Commitment to the Earth', 'पृथ्वी के प्रति हमारी प्रतिबद्धता')}
              </h3>
              <p className="text-teal-100/70 text-lg leading-relaxed">
                {t('True luxury should not come at the cost of the environment. Lake Breeze is committed to zero-waste protocols, rainwater harvesting, and organic farming that supplies 40% of our kitchens.', 'सच्ची विलासिता पर्यावरण की कीमत पर नहीं आनी चाहिए। लेक ब्रीज जीरो-वेस्ट प्रोटोकॉल, वर्षा जल संचयन और जैविक खेती के लिए प्रतिबद्ध है जो हमारी रसोई का 40% हिस्सा प्रदान करती है।')}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                 {[
                   { icon: <Award className="text-teal-400" />, title: t('Eco Certified', 'इको प्रमाणित') },
                   { icon: <Users className="text-teal-400" />, title: t('Community Growth', 'सामुदायिक विकास') }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center gap-4 p-4 bg-teal-800/30 rounded-2xl border border-teal-700">
                      {item.icon}
                      <span className="font-bold text-sm tracking-tight">{item.title}</span>
                   </div>
                 ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="/sustainable_luxury_garden_1778950196361.png" 
                alt="Sustainable Garden" 
                className="w-full h-[300px] md:h-[500px] object-cover rounded-[40px] shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F4C4C] mb-6">{t('The Pillars of Our Soul', 'हमारी आत्मा के स्तंभ')}</h2>
            <div className="w-24 h-1 bg-[#0F4C4C] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-16">
            {[
              { icon: <ShieldCheck size={40} />, title: t('Uncompromising Trust', 'अटूट विश्वास'), desc: t('Your safety and privacy are the cornerstones of our hospitality.', 'आपकी सुरक्षा और गोपनीयता हमारे आतिथ्य की आधारशिला हैं।') },
              { icon: <Heart size={40} />, title: t('Genuine Care', 'सच्ची देखभाल'), desc: t('Our staff is trained to anticipate your needs and deliver heartfelt service.', 'हमारे कर्मचारी आपकी आवश्यकताओं का पूर्वानुमान लगाने के लिए प्रशिक्षित हैं।') },
              { icon: <Star size={40} />, title: t('Local Soul', 'स्थानीय आत्मा'), desc: t('We celebrate Kerala culture in every meal, room, and experience.', 'हम हर भोजन, कमरे और अनुभव में केरल की संस्कृति का जश्न मनाते हैं।') }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 hover:border-[#0F4C4C]/20 transition-all text-center space-y-6"
              >
                <div className="w-16 h-16 bg-[#0F4C4C]/5 text-[#0F4C4C] rounded-2xl flex items-center justify-center mx-auto">{value.icon}</div>
                <h4 className="text-xl font-bold text-[#0F4C4C] tracking-tight">{value.title}</h4>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-16 bg-[#F8FAFA]">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="space-y-12">
            {milestones.map((m, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center"
              >
                <div className="text-3xl md:text-5xl font-black text-[#0F4C4C]/10 md:w-32">{m.year}</div>
                <div className="flex-1 p-6 md:p-8 bg-white border border-gray-100 rounded-[24px] shadow-sm">
                  <h5 className="text-xl font-bold text-[#0F4C4C] mb-2">{m.title}</h5>
                  <p className="text-gray-500 text-sm md:text-base">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
