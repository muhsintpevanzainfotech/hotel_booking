import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Heart, History, Leaf, MapPin, Users, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import bathroomImg from '../assets/images/bathroom.jpeg';
import bgImg from '../assets/images/bg.jpeg';
import coupleImg from '../assets/images/couple.jpeg';
import masterImg from '../assets/images/master.jpeg';
import roomImg from '../assets/images/room.jpeg';
import roomsImg from '../assets/images/rooms.jpeg';
import sitoutImg from '../assets/images/sitout.jpeg';

const About = () => {
  const { t } = useLanguage();

  const milestones = [
    { year: '2018', title: t('The Vision', 'दृष्टिकोण', 'കാഴ്ചപ്പാട്'), desc: t('Founded in Wayanad and Calicut with a focus on immersive hospitality.', 'शानदार आतिथ्य पर ध्यान देने के साथ वायनाड और कोझिकोड में स्थापना।', 'വയനാട്ടിലും കോഴിക്കോട്ടും സമാനതകളില്ലാത്ത ഹോസ്പിറ്റാലിറ്റിയോടെ തുടക്കം കുറിച്ചു.') },
    { year: '2020', title: t('Expansion', 'विस्तार', 'വ്യാപനം'), desc: t('Added luxurious accommodations and expanded to premium cottages.', 'शानदार आवास जोड़े और प्रीमियम कॉटेज का विस्तार किया।', 'ആഡംബര താമസസൗകര്യങ്ങളും പ്രീമിയം കോട്ടേജുകളും കൂട്ടിച്ചേർത്തു.') },
    { year: '2023', title: t('Excellence Award', 'उत्कृष्टता पुरस्कार', 'അംഗീകാരം'), desc: t('Voted #1 Resort in the region for connection and well-being.', 'जुड़ाव और कल्याण के लिए क्षेत्र में #1 रिज़ॉर्ट चुना गया।', 'പ്രാദേശിക തലത്തിൽ ഏറ്റവും മികച്ച റിസോർട്ടായി തിരഞ്ഞെടുക്കപ്പെട്ടു.') },
    { year: '2026', title: t('Timeless Escapes', 'कालातीत पलायन', 'ശാശ്വത അനുഭവങ്ങൾ'), desc: t('Continuing our unwavering commitment to extraordinary experiences.', 'असाधारण अनुभवों के प्रति हमारी अटूट प्रतिबद्धता को जारी रखना।', 'അസാധാരണമായ അനുഭവങ്ങളോടുള്ള ഞങ്ങളുടെ പ്രതിജ്ഞാബദ്ധത തുടരുന്നു.') },
  ];

  return (
    <div className="bg-[#F8FAFA] min-h-screen">
      {/* Page Header */}
      <section className="px-4 py-4 md:px-8 md:py-6 bg-white w-full max-w-[1400px] mx-auto">
        <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col justify-center items-center text-center shadow-md">
          {/* Background image & Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={sitoutImg}
              alt="About Us Banner"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Dark green gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/90 via-[#0F4C4C]/80 to-teal-900/60 backdrop-blur-[1px]" />
          </div>
          
          {/* Header Text Content */}
          <div className="relative z-10 text-white space-y-3 px-4 sm:px-6">
            <div className="flex items-center justify-center gap-2 text-teal-300 opacity-80">
              <History size={16} className="text-teal-300" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">{t('Our Story', 'हमारी कहानी', 'ഞങ്ങളുടെ കഥ')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
              {t('About Us', 'हमारे बारे में', 'ഞങ്ങളെക്കുറിച്ച്')}
            </h1>
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-teal-200">
              <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम', 'ഹോം')}</Link>
              <span>•</span>
              <span className="text-white">{t('About Us', 'हमारे बारे में', 'ഞങ്ങളെക്കുറിച്ച്')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Our Story & Mockup Layout */}
      <section className="py-16 md:py-24 max-w-[1400px] mx-auto px-6 bg-transparent">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          
          {/* Left Column - Tall rounded image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <img 
              src={masterImg} 
              alt="Lake Breeze Resort Architecture" 
              className="w-full h-full min-h-[400px] lg:min-h-[550px] object-cover rounded-[32px] shadow-xl" 
            />
          </motion.div>

          {/* Middle Column - Heading, texts and CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 flex flex-col justify-center space-y-6 md:space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-black text-[#0F4C4C] tracking-tight leading-tight">
              {t('A Symphony of Serenity Crafting Timeless Escapes', 'शांति का एक राग: कालातीत पलायन का निर्माण', 'ശാന്തതയുടെ സമന്വയം: ശാശ്വതമായ അനുഭവങ്ങളുടെ ആവിഷ്കാരം')}
            </h2>
            
            <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
              {t(
                "In the heart of Wayanad and Calicut, Lake Breeze Resorts has unfurled a tapestry of tranquillity since 2018. Nestled in nature's embrace, our retreats offer an unparalleled blend of luxury and authenticity, creating spaces where every moment becomes a cherished memory. Immerse yourself in a haven designed to awaken the senses and rejuvenate the soul.",
                "वायनाड और कोझिकोड के केंद्र में, लेक ब्रीज रिसॉर्ट्स ने 2018 से शांति की एक सुंदर शुरुआत की है। प्रकृति की गोद में बसे, हमारे रिसॉर्ट्स विलासिता और प्रामाणिकता का एक अनूठा मिश्रण पेश करते हैं, जिससे ऐसे स्थान बनते हैं जहां हर पल एक सुखद याद बन जाता है। इंद्रियों को जगाने और आत्मा को तरोताजा करने के लिए डिज़ाइन किए गए स्वर्ग में खुद को विसर्जित करें।",
                "വയനാടിന്റെയും കോഴിക്കോടിന്റെയും ഹൃദയഭാഗത്ത്, ലേക്ക് ബ്രീസ് റിസോർട്ടുകൾ 2018 മുതൽ സമാധാനത്തിന്റെ ഒരു പുതിയ ലോകം തുറന്നുതരുന്നു. പ്രകൃതിയുടെ മടിത്തട്ടിൽ സ്ഥിതി ചെയ്യുന്ന ഞങ്ങളുടെ റിസോർട്ടുകൾ ആഡംബരത്തിന്റെയും തനിമയുടെയും സമാനതകളില്ലാത്ത സങ്കലനം വാഗ്ദാനം ചെയ്യുന്നു."
              )}
            </p>
            
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              {t(
                "Lake Breeze Resorts, a sanctuary established in 2018, is more than a destination; it's a testament to the art of immersive hospitality. Our commitment to crafting timeless escapes is woven into every detail, from the luxurious accommodations to the lush surroundings, ensuring a harmonious retreat where nature and elegance dance in perfect balance. Embark on a journey beyond conventional retreats, where Lake Breeze Resorts embodies an unwavering commitment to excellence. Our ethos transcends the ordinary, creating havens that inspire connection, relaxation, and a profound sense of well-being. Discover the essence of hospitality redefined amid the breathtaking landscapes of Wayanad and Calicut.",
                "2018 में स्थापित एक अभयारण्य, लेक ब्रीज रिसॉर्ट्स एक गंतव्य से कहीं अधिक है; यह शानदार आतिथ्य की कला का एक प्रमाण है। कालातीत पलायन को तैयार करने की हमारी प्रतिबद्धता हर विवरण में बुनी गई है, शानदार आवासों से लेकर हरे-भरे परिवेश तक, एक सामंजस्यपूर्ण वापसी सुनिश्चित करती है जहां प्रकृति और लालित्य सही संतुलन में नृत्य करते हैं। पारंपरिक विश्राम स्थलों से परे एक यात्रा शुरू करें, जहां लेक ब्रीज रिसॉर्ट्स उत्कृष्टता के प्रति अटूट प्रतिबद्धता का प्रतीक है। हमारा लोकाचार साधारण से परे है, जो ऐसे आश्रय स्थल बनाता है जो जुड़ाव, विश्राम और कल्याण की गहरी भावना को प्रेरित करते हैं। वायनाड और कोझिकोड के लुभावने परिदृश्यों के बीच आतिथ्य के पुनर्परिभाषित सार की खोज करें।",
                "2018-ൽ സ്ഥാപിതമായ ലേക്ക് ബ്രീസ് റിസോർട്ടുകൾ വെറുമൊരു ലക്ഷ്യസ്ഥാനമല്ല, മറിച്ച് സമാനതകളില്ലാത്ത ഹോസ്പിറ്റാലിറ്റിയുടെ തെളിവാണ്. പ്രകൃതിയും ചാരുതയും സമന്വയിക്കുന്ന ഞങ്ങളുടെ കോട്ടേജുകൾ നിങ്ങളുടെ യാത്രയെ അവിസ്മരണീയമാക്കുന്നു."
              )}
            </p>

            <Link 
              to="/rooms" 
              className="inline-flex items-center justify-between gap-6 bg-neutral-950 hover:bg-neutral-900 text-white pl-8 pr-2 py-2 rounded-full w-fit shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold uppercase tracking-widest text-[10px] group"
            >
              <span>{t('Explore Our Rooms', 'कमरों की खोज करें', 'മുറികൾ കാണുക')}</span>
              <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={14} className="stroke-[3]" />
              </span>
            </Link>
          </motion.div>

          {/* Right Column - Stats and small rounded image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 flex flex-col justify-between gap-8"
          >
            {/* 8. Years of Experience */}
            <div className="flex items-center gap-4 py-4 md:py-6 border-b border-gray-100 lg:border-none">
              <span className="text-7xl md:text-8xl font-black text-[#0F4C4C] tracking-tighter leading-none">8.</span>
              <div className="flex flex-col text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-tight">
                <span>{t('Years Of', 'वर्षों का', 'വർഷത്തെ')}</span>
                <span>{t('Experience', 'अनुभव', 'പ്രവൃത്തിപരിചയം')}</span>
              </div>
            </div>
            
            {/* Small rounded card image */}
            <div className="relative overflow-hidden rounded-[28px] shadow-lg flex-1 min-h-[220px]">
              <img 
                src={roomImg} 
                alt="Lake Breeze Deluxe Experience" 
                className="w-full h-full object-cover absolute inset-0 hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 order-2 md:order-1"
            >
              <img 
                src={roomsImg} 
                alt="Extraordinary Experiences" 
                className="w-full h-full-[300px] md:h-[500px] object-cover rounded-[40px] shadow-xl"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 space-y-6 order-1 md:order-2"
            >
              <div className="flex items-center gap-3 opacity-60">
                <Star size={18} className="text-[#0F4C4C]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F4C4C]">{t('Our Promise', 'हमारा वादा', 'ഞങ്ങളുടെ വാഗ്ദാനം')}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#0F4C4C] tracking-tight leading-tight">
                {t('Our Commitment to Extraordinary Experiences', 'असाधारण अनुभवों के प्रति हमारी प्रतिबद्धता', 'അസാധാരണമായ അനുഭവങ്ങളോടുള്ള ഞങ്ങളുടെ പ്രതിജ്ഞാബദ്ധത')}
              </h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {t(
                  "At Lake Breeze Resorts, our ethos goes beyond providing a place to stay; it's about curating experiences that resonate with the soul. We believe in the transformative power of hospitality, where every guest becomes part of a narrative that celebrates the beauty of connection and the joy found in moments shared. In Wayanad and Calicut, we invite you to go beyond boundaries and immerse yourself in the extraordinary.",
                  "लेक ब्रीज रिसॉर्ट्स में, हमारा लोकाचार ठहरने की जगह प्रदान करने से कहीं आगे जाता है; यह उन अनुभवों को संजोने के बारे में है जो आत्मा को छूते हैं। हम आतिथ्य की परिवर्तनकारी शक्ति में विश्वास करते हैं, जहां हर अतिथि एक ऐसी कहानी का हिस्सा बन जाता है जो जुड़ाव की सुंदरता और साझा किए गए क्षणों में मिलने वाली खुशी का जश्न बनाती है। वायनाड और कोझिकोड में, हम आपको सीमाओं से परे जाने और असाधारण में खुद को विसर्जित करने के लिए आमंत्रित करते हैं।",
                  "ലേക്ക് ബ്രീസ് റിസോർട്ടിൽ, ഞങ്ങളുടെ തത്വശാസ്ത്രം വെറുമൊരു താമസസ്ഥലം ഒരുക്കുന്നതിനും അപ്പുറമാണ്; അത് ആത്മാവിനെ സ്പർശിക്കുന്ന അനുഭവങ്ങൾ സമ്മാനിക്കുന്നതിനെക്കുറിച്ചാണ്. പരസ്പര ബന്ധത്തിന്റെ ഭംഗിയും സന്തോഷവും ആഘോഷിക്കുന്ന ഒരു യാത്രയിലേക്ക് ഞങ്ങൾ നിങ്ങളെ സ്വാഗതം ചെയ്യുന്നു."
                )}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                 <div className="space-y-2">
                    <p className="text-[#0F4C4C] font-bold">100%</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('Guest Satisfaction', 'अतिथि संतुष्टि', 'അതിഥി സംതൃപ്തി')}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[#0F4C4C] font-bold">24/7</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('Immersive Service', 'इमर्सिव सेवा', 'സേവനം')}</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sustainable Luxury Section */}
      <section className="py-16 md:py-16 bg-[#0F4C4C] text-white overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
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
                src={bathroomImg} 
                alt="Sustainable Garden" 
                className="w-full h-[300px] md:h-[500px] object-cover rounded-[40px] shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
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
        <div className="max-w-[1200px] mx-auto px-6">
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
