import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail, Phone, Users, CheckCircle, ChevronRight, Sparkles, Check, Info, ShieldCheck, MapPin, Compass, ShieldAlert, Image as ImageIcon, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLanguage } from '../../context/LanguageContext';
import { getImageUrl } from '../../utils/imageHelper';
import { calculateDiscountAmount, validatePromoCode } from '../../utils/promoHelper';

// Import local assets for mock gallery
import sitoutImg from '../../assets/images/sitout.jpeg';
import coupleImg from '../../assets/images/couple.jpeg';
import familyImg from '../../assets/images/family.jpeg';
import roomsImg from '../../assets/images/rooms.jpeg';
import bathroomImg from '../../assets/images/bathroom.jpeg';

const ComboBookingModal = ({ isOpen, onClose, combo }) => {
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(null);
    const [formData, setFormData] = useState({
        guestName: '',
        email: '',
        phone: '',
        checkIn: null,
        checkOut: null,
        guestsCount: 2,
        specialRequests: ''
    });

    const [totalPrice, setTotalPrice] = useState(0);
    const [offers, setOffers] = useState([]);
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE}/offers`);
                if (res.ok) {
                    const data = await res.json();
                    setOffers(data);
                }
            } catch (e) {
                console.error("Failed to fetch offers", e);
            }
        };
        fetchOffers();
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsSubmitting(false);
            setBookingSuccess(null);
            setFormData({
                guestName: '',
                email: '',
                phone: '',
                checkIn: null,
                checkOut: null,
                guestsCount: 2,
                specialRequests: ''
            });
            setPromoInput('');
            setAppliedPromo(null);
            setPromoError('');
            setPromoDiscount(0);
        }
    }, [isOpen, combo]);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);

    // Dynamic Metadata Generators based on package title & category
    const details = useMemo(() => {
        if (!combo) return null;
        
        const titleLower = combo.title.toLowerCase();
        const typeLower = (combo.type || '').toLowerCase();

        // 1. Determine Duration
        let duration = t('3 Days / 2 Nights', '3 दिन / 2 रात');
        if (titleLower.includes('weekend') || typeLower.includes('weekend')) {
            duration = t('3 Days / 2 Nights', '3 दिन / 2 रात');
        } else if (titleLower.includes('honeymoon') || titleLower.includes('romantic') || titleLower.includes('couple')) {
            duration = t('4 Days / 3 Nights', '4 दिन / 3 रात');
        } else if (titleLower.includes('extended') || titleLower.includes('wellness') || titleLower.includes('nature')) {
            duration = t('5 Days / 4 Nights', '5 दिन / 4 रात');
        }

        // 2. Determine Guest Capacity
        let capacity = t('2 Adults & 1 Child', '2 वयस्क और 1 बच्चा');
        if (titleLower.includes('family') || titleLower.includes('group') || typeLower.includes('group')) {
            capacity = t('Up to 4 Guests', '4 अतिथियों तक');
        } else if (titleLower.includes('romantic') || titleLower.includes('couple') || titleLower.includes('honeymoon')) {
            capacity = t('2 Adults', '2 वयस्क');
        }

        // 3. Determine Popular/Best Value Badge
        let badge = null;
        if (combo.price < 15000) {
            badge = t('Best Value', 'सर्वोत्तम मूल्य');
        } else if (titleLower.includes('romantic') || titleLower.includes('family') || titleLower.includes('signature')) {
            badge = t('Popular', 'लोकप्रिय');
        }

        // 4. Generate curated highlights based on title/type
        let highlights = [
            t('Luxury accommodation with waterfront views', 'सुंदर जलदृश्य वाले सुइट में आवास'),
            t('Daily signature gourmet breakfast & dinner sessions', 'दैनिक नाश्ता और शानदार रात्रिभोज'),
            t('Complimentary backwater boat cruise experience', 'पूरक बैकवाटर बोट क्रूज़ अनुभव'),
            t('Access to high-speed internet & premium amenities', 'हाई-स्पीड इंटरनेट और प्रीमियम सुविधाएं')
        ];
        if (titleLower.includes('spa') || titleLower.includes('wellness') || titleLower.includes('ayurveda')) {
            highlights = [
                t('Personalized Ayurvedic wellness consultation', 'व्यक्तिगत आयुर्वेदिक परामर्श'),
                t('Daily therapeutic spa & massage session', 'दैनिक स्पा और मालिश सत्र'),
                t('Organic detox juices & custom dietary meals', 'ऑर्गेनिक डिटॉक्स जूस और विशेष भोजन'),
                t('Sunrise yoga & traditional wellness sessions', 'सूर्योदय योग और कल्याण सत्र')
            ];
        } else if (titleLower.includes('romantic') || titleLower.includes('couple') || titleLower.includes('honeymoon')) {
            highlights = [
                t('Welcome bottle of premium sparkling wine & chocolates', 'प्रीमियम वाइन और चॉकलेट का स्वागत पैकेज'),
                t('Private candlelit dinner by the lake shore', 'झील के किनारे निजी कैंडललाइट डिनर'),
                t('Flower petal bath & luxury room decor decoration', 'फूलों की सजावट और लक्जरी रूम डेकोर'),
                t('Couples traditional Ayurvedic therapy session', 'युगल पारंपरिक आयुर्वेदिक थेरेपी सत्र')
            ];
        }

        // 5. Generate matching resort activities
        let activities = [
            t('Sunrise Yoga & Meditation', 'सूर्योदय योग और ध्यान'),
            t('Traditional Kerala Cooking Masterclass', 'केरल कुकिंग मास्टरक्लास'),
            t('Sunset Backwater Canoe Cruise', 'सूर्यास्त बोट क्रूज़'),
            t('Estate Guided Heritage Walk', 'गाइडेड हेरिटेज वॉक')
        ];

        // 6. Terms & Conditions
        const terms = [
            t('Rates are subject to 18% GST.', 'दरें 18% जीएसटी के अधीन हैं।'),
            t('A 50% advance deposit is required to confirm reservation.', 'बुकिंग की पुष्टि के लिए 50% अग्रिम जमा आवश्यक है।'),
            t('Free cancellation up to 7 days prior to check-in date.', 'आगमन से 7 दिन पहले तक मुफ्त रद्दीकरण उपलब्ध है।'),
            t('Resort Check-in is 2:00 PM; Check-out is 11:00 AM.', 'चेक-इन दोपहर 2:00 बजे है; चेक-आउट सुबह 11:00 बजे है।')
        ];

        // 7. Curate dynamic photo gallery
        const cover = combo.coverImage ? getImageUrl(combo.coverImage) : sitoutImg;
        const gallery = [cover, coupleImg, familyImg, roomsImg, bathroomImg].filter(Boolean);

        return {
            duration,
            capacity,
            badge,
            highlights,
            activities,
            terms,
            gallery
        };
    }, [combo, t]);

    useEffect(() => {
        if (combo) {
            const originalTotal = combo.price;
            if (appliedPromo) {
                const disc = calculateDiscountAmount(appliedPromo.discount, originalTotal);
                setPromoDiscount(disc);
                setTotalPrice(originalTotal - disc);
            } else {
                setPromoDiscount(0);
                setTotalPrice(originalTotal);
            }
        }
    }, [combo, appliedPromo]);

    const handleApplyPromo = (e) => {
        e.preventDefault();
        setPromoError('');
        if (!promoInput.trim()) {
            setAppliedPromo(null);
            return;
        }
        
        const offer = validatePromoCode(promoInput, offers);
        if (offer) {
            setAppliedPromo(offer);
            toast.success(t('Promo code applied successfully!', 'प्रोमो कोड सफलतापूर्वक लागू किया गया!'));
        } else {
            setAppliedPromo(null);
            setPromoError(t('Invalid or expired promo code', 'अमान्य या समाप्त प्रोमो कोड'));
            toast.error(t('Invalid promo code', 'अमान्य प्रोमो कोड'));
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoInput('');
        setPromoError('');
        toast.success(t('Promo code removed', 'प्रोमो कोड हटा दिया गया'));
    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === 'guestName') {
            value = value.replace(/\b\w/g, char => char.toUpperCase());
        } else if (name === 'specialRequests') {
            if (value.length > 0) {
                value = value.charAt(0).toUpperCase() + value.slice(1);
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.checkIn || !formData.checkOut) {
            return toast.error(t('Please select dates', 'कृपया तिथियां चुनें'));
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestName: formData.guestName,
                    email: formData.email,
                    phone: formData.phone,
                    checkIn: formData.checkIn,
                    checkOut: formData.checkOut,
                    adults: formData.guestsCount,
                    children: 0,
                    specialRequests: formData.specialRequests,
                    room: combo._id,
                    totalPrice: totalPrice,
                    promoCode: appliedPromo ? appliedPromo.code : undefined,
                    discountAmount: promoDiscount
                })
            });

            const data = await response.json();
            if (response.ok) {
                setBookingSuccess(data);
                toast.success(t('Booking submitted successfully!', 'बुकिंग सफलतापूर्वक भेजी गई!'));
            } else {
                toast.error(data.message || t('Booking failed', 'बुकिंग विफल रही'));
            }
        } catch (err) {
            toast.error(t('Network error', 'नेटवर्क त्रुटि'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !combo || !details) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-2 sm:p-4">
                {/* Backdrop Blur */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0F4C4C]/20 backdrop-blur-xl" 
                    onClick={onClose}
                ></motion.div>
                
                {/* Premium Layout Modal Card */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 150 }}
                    className="relative w-full max-w-6xl bg-white rounded-[32px] md:rounded-[40px] shadow-[0_50px_100px_-20px_rgba(15,76,76,0.3)] overflow-hidden border border-white flex flex-col md:flex-row h-[90vh] md:h-[85vh] lg:h-[80vh]"
                >
                    {/* Close Button */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-5 right-5 z-40 p-2.5 bg-white/90 hover:bg-white text-[#0F4C4C] rounded-full transition-all active:scale-90 shadow-md border border-gray-100 cursor-pointer"
                    >
                        <X size={18} />
                    </button>

                    {/* COLUMN 1: Package Details (Left Scrollable Panel) */}
                    <div className="w-full md:w-[58%] overflow-y-auto p-6 md:p-10 lg:p-12 no-scrollbar md:h-full flex flex-col gap-8">
                        {/* Title Header with Badges */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3.5 py-1 bg-[#0F4C4C]/5 border border-[#0F4C4C]/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#0F4C4C]">
                                    {combo.type || t('Package', 'पैकेज')}
                                </span>
                                {details.badge && (
                                    <span className="px-3.5 py-1 bg-lime-400 text-neutral-900 border border-lime-300 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                        <Sparkles size={9} className="fill-neutral-900" />
                                        {details.badge}
                                    </span>
                                )}
                            </div>
                            
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F4C4C] tracking-tight leading-tight">
                                {combo.title}
                            </h2>

                            {/* Duration & Capacity Tags */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-wider text-gray-400 pt-1">
                                <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1 rounded-xl border border-neutral-150">
                                    <Calendar size={12} className="text-[#2E7D7D]" />
                                    {details.duration}
                                </span>
                                <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1 rounded-xl border border-neutral-150">
                                    <Users size={12} className="text-[#2E7D7D]" />
                                    {details.capacity}
                                </span>
                            </div>
                        </div>

                        {/* Starting Price Block */}
                        <div className="p-5 bg-gradient-to-r from-teal-50/50 to-neutral-50 rounded-2xl border border-neutral-100 flex flex-col gap-3 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#2E7D7D]">{t('Price Details', 'दर विवरण')}</span>
                                    <p className="text-xs font-semibold text-gray-500">{t('All-Inclusive Signature Rate', 'सर्व-समावेशी सिग्नेचर दर')}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl md:text-3xl font-black text-[#0F4C4C] tracking-tighter">₹{totalPrice.toLocaleString()}</span>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none">{t('per package', 'प्रति पैकेज')}</span>
                                </div>
                            </div>
                            {appliedPromo && promoDiscount > 0 && (
                                <div className="flex flex-col gap-1 border-t border-[#0F4C4C]/10 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    <div className="flex justify-between">
                                        <span>{t('Original Rate', 'मूल दर')}</span>
                                        <span>₹{combo.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-600">
                                        <span>{t('Discount Amount', 'छूट राशि')}</span>
                                        <span>-₹{promoDiscount.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('About the Experience', 'इस अनुभव के बारे में')}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                {combo.description || t('Redefine luxury at our signature waterfront retreat. Indulge in state-of-the-art heritage accommodations, customized wellness offerings, and scenic backwater excursions curated by our hospitality specialists.', 'हमारे सिग्नेचर वाटरफ्रंट रिट्रीट में लक्जरी का अनुभव करें। हमारी टीम द्वारा विशेष रूप से तैयार की गई सुविधाओं का आनंद लें।')}
                            </p>
                        </div>

                        {/* Image Gallery */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <ImageIcon size={14} className="text-[#2E7D7D]" />
                                <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Resort Gallery', 'सैलून और रिज़ॉर्ट गैलरी')}</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-3 h-[180px] sm:h-[220px] rounded-2xl overflow-hidden shadow-sm relative group">
                                    <img 
                                        src={details.gallery[0]} 
                                        alt="Main view" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                {details.gallery.slice(1, 4).map((img, idx) => (
                                    <div key={idx} className="h-[70px] sm:h-[100px] rounded-xl overflow-hidden shadow-sm relative group">
                                        <img 
                                            src={img} 
                                            alt={`Resort detail ${idx + 1}`} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Includes & Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            {/* Includes list */}
                            {combo.includes && combo.includes.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Package Includes', 'पैकेज में शामिल')}</h4>
                                    <ul className="space-y-2">
                                        {combo.includes.map((inc, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-xs text-gray-500 font-semibold leading-relaxed">
                                                <Check size={14} className="text-[#2E7D7D] shrink-0 mt-0.5" />
                                                <span>{inc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Highlights */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Estate Highlights', 'प्रमुख आकर्षण')}</h4>
                                <ul className="space-y-2">
                                    {details.highlights.map((high, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-xs text-gray-500 font-semibold leading-relaxed">
                                            <Sparkles size={13} className="text-[#2E7D7D] shrink-0 mt-0.5" />
                                            <span>{high}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Activities */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2">
                                <Compass size={14} className="text-[#2E7D7D]" />
                                <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Signature Activities', 'विशेष गतिविधियां')}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {details.activities.map((act, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm">
                                        <div className="w-2.5 h-2.5 bg-teal-500/20 rounded-full flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 bg-[#2E7D7D] rounded-full" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-700">{act}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="space-y-3 border-t border-gray-100 pt-6">
                            <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Terms & Guidelines', 'नियम और दिशानिर्देश')}</h4>
                            <ul className="space-y-2 text-[11px] text-gray-400 font-medium leading-relaxed">
                                {details.terms.map((term, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-[#2E7D7D]">•</span>
                                        <span>{term}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* COLUMN 2: Booking Form (Right sticky/scrollable panel) */}
                    <div className="w-full md:w-[42%] bg-[#F8FAFA] p-6 md:p-10 lg:p-12 border-t md:border-t-0 md:border-l border-gray-100 overflow-y-auto no-scrollbar md:h-full flex flex-col justify-between shrink-0 min-h-[450px]">
                        {!bookingSuccess ? (
                            <div className="h-full flex flex-col justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <h3 className="text-xl font-black text-[#0F4C4C] tracking-tight">{t('Reserve Package', 'पैकेज बुक करें')}</h3>
                                        <p className="text-gray-400 text-xs leading-normal">{t('Complete the form details below to reserve your custom package experience.', 'अपना पैकेज अनुभव रिज़र्व करने के लिए नीचे दिए गए विवरण को पूरा करें।')}</p>
                                    </div>

                                    {/* Auto-filled Selected Package Card */}
                                    <div className="space-y-1 bg-[#0F4C4C]/5 p-4 rounded-2xl border border-[#0F4C4C]/10 flex items-center justify-between shadow-sm">
                                        <div>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-[#0F4C4C]/60">{t('Selected Package', 'चयनित पैकेज')}</span>
                                            <h4 className="text-xs font-black text-[#0F4C4C] truncate max-w-[170px] sm:max-w-xs">{combo.title}</h4>
                                        </div>
                                        <span className="text-[10px] font-black text-[#0F4C4C] bg-white border border-[#0F4C4C]/15 px-3 py-1 rounded-xl shadow-sm">
                                            ₹{combo.price.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Inquiry Form */}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Check In */}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C]/60 ml-1">{t('Check In', 'आगमन')}</label>
                                                <div className="relative group">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors z-10" size={15} />
                                                    <DatePicker
                                                        selected={formData.checkIn}
                                                        onChange={(date) => handleDateChange('checkIn', date)}
                                                        className="w-full pl-11 pr-3 py-3.5 bg-white border border-neutral-200/40 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none shadow-sm"
                                                        placeholderText={t('Select Date', 'तिथि चुनें')}
                                                        minDate={new Date()}
                                                        dateFormat="dd/MM/yyyy"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Check Out */}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C]/60 ml-1">{t('Check Out', 'प्रस्थान')}</label>
                                                <div className="relative group">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors z-10" size={15} />
                                                    <DatePicker
                                                        selected={formData.checkOut}
                                                        onChange={(date) => handleDateChange('checkOut', date)}
                                                        className="w-full pl-11 pr-3 py-3.5 bg-white border border-neutral-200/40 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none shadow-sm"
                                                        placeholderText={t('Select Date', 'तिथि चुनें')}
                                                        minDate={formData.checkIn || new Date()}
                                                        dateFormat="dd/MM/yyyy"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Guests Count */}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C]/60 ml-1">{t('Guests', 'अतिथि')}</label>
                                                <div className="relative group">
                                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors z-10 pointer-events-none" size={15} />
                                                    <select 
                                                        name="guestsCount" 
                                                        value={formData.guestsCount} 
                                                        onChange={handleInputChange}
                                                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-200/40 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none appearance-none shadow-sm"
                                                        required
                                                    >
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                            <option key={n} value={n}>{n} {n === 1 ? t('Guest', 'अतिथि') : t('Guests', 'अतिथि')}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Full Name */}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C]/60 ml-1">{t('Full Name', 'पूरा नाम')}</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={15} />
                                                    <input 
                                                        type="text" 
                                                        name="guestName" 
                                                        value={formData.guestName} 
                                                        onChange={handleInputChange}
                                                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-200/40 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none shadow-sm"
                                                        placeholder="John Doe"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Phone */}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C]/60 ml-1">{t('Phone', 'फ़ोन')}</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={15} />
                                                    <input 
                                                        type="tel" 
                                                        name="phone" 
                                                        value={formData.phone} 
                                                        onChange={handleInputChange}
                                                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-200/40 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none shadow-sm"
                                                        placeholder="+91 00000 00000"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C]/60 ml-1">{t('Email Address', 'ईमेल')}</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={15} />
                                                    <input 
                                                        type="email" 
                                                        name="email" 
                                                        value={formData.email} 
                                                        onChange={handleInputChange}
                                                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-200/40 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none shadow-sm"
                                                        placeholder="john@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Special Requests */}
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C]/60 ml-1">{t('Special Requests', 'विशेष अनुरोध')}</label>
                                            <textarea 
                                                name="specialRequests" 
                                                value={formData.specialRequests} 
                                                onChange={handleInputChange}
                                                className="w-full bg-white border border-neutral-200/40 rounded-2xl p-4 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] h-18 resize-none outline-none transition-all shadow-sm"
                                                placeholder={t('Anything we should arrange?', 'क्या हमें कुछ प्रबंधित करना चाहिए?')}
                                            ></textarea>
                                        </div>

                                        {/* Promo Code Integration */}
                                        <div className="space-y-2 bg-neutral-100/50 p-4 rounded-[20px] border border-neutral-200/30">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C4C]/60 ml-1 flex items-center gap-1.5">
                                                <Tag size={12} className="text-[#2E7D7D]" />
                                                {t('Promo Code', 'प्रोमो कोड')}
                                            </label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={promoInput} 
                                                    onChange={(e) => setPromoInput(e.target.value)}
                                                    disabled={!!appliedPromo}
                                                    placeholder={t('Enter promo code...', 'प्रोमो कोड दर्ज करें...')}
                                                    className="flex-grow px-4 py-3 bg-white border border-neutral-200/40 rounded-xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] outline-none transition-all uppercase placeholder:normal-case disabled:opacity-60"
                                                />
                                                {appliedPromo ? (
                                                    <button 
                                                        type="button" 
                                                        onClick={handleRemovePromo}
                                                        className="px-4 py-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 cursor-pointer shrink-0"
                                                    >
                                                        {t('Remove', 'हटाएं')}
                                                    </button>
                                                ) : (
                                                    <button 
                                                        type="button" 
                                                        onClick={handleApplyPromo}
                                                        className="px-4 py-3 bg-[#0F4C4C] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#2E7D7D] transition-all active:scale-95 cursor-pointer shrink-0"
                                                    >
                                                        {t('Apply', 'लागू करें')}
                                                    </button>
                                                )}
                                            </div>
                                            {promoError && (
                                                <p className="text-rose-500 text-[9px] font-bold uppercase tracking-wider ml-1">{promoError}</p>
                                            )}
                                            {appliedPromo && (
                                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 text-[9px] font-bold uppercase tracking-wider">
                                                    <CheckCircle size={12} className="shrink-0" />
                                                    <span>
                                                        {appliedPromo.code} ({appliedPromo.discount} OFF)
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Total price breakdown preview */}
                                        {appliedPromo && promoDiscount > 0 && (
                                            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 flex items-center justify-between text-[#0F4C4C]">
                                                <div className="space-y-0.5">
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-[#2E7D7D]">{t('Calculated Price', 'कुल अनुमानित राशि')}</p>
                                                    <p className="text-[9px] font-bold text-gray-550">
                                                        {t('Promo discount applied', 'प्रोमो छूट लागू')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-black tracking-tighter">₹{totalPrice.toLocaleString()}</span>
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none">{t('Total', 'कुल')}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="pt-2">
                                            <button 
                                                type="submit" 
                                                disabled={isSubmitting}
                                                className="btn-book-now w-full py-4 text-[10px] cursor-pointer"
                                            >
                                                {isSubmitting ? t('Processing...', 'प्रक्रिया...') : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        {t('Confirm Package Booking', 'पैकेज बुकिंग की पुष्टि करें')}
                                                        <ChevronRight size={14} />
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            /* SUCCESS VIEW */
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6 md:py-16 space-y-6 flex flex-col justify-center items-center h-full"
                            >
                                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm shrink-0">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-black text-[#0F4C4C] tracking-tight leading-tight">
                                    {t('Package Reserved!', 'पैकेज बुकिंग पक्की हो गई!')}
                                </h3>
                                <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                                    {t('Your booking for ', 'आपका बुकिंग ')} <span className="text-[#0F4C4C] font-bold">{combo.title}</span> {t('has been successfully submitted. A confirmation email has been sent to you.', 'सफलतापूर्वक प्राप्त हो गई है। आपको एक ईमेल भेजा गया है।')}
                                </p>
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 inline-block relative shadow-sm">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#0F4C4C] text-white rounded-full text-[7px] font-black uppercase tracking-[0.4em]">{t('Booking ID', 'बुकिंग आईडी')}</div>
                                    <p className="text-base font-mono font-bold text-[#0F4C4C] tracking-tighter">{bookingSuccess.bookingReference}</p>
                                </div>
                                <div className="pt-6 w-full max-w-[200px]">
                                    <button onClick={onClose} className="btn-book-now w-full py-3.5 text-[9px] cursor-pointer">
                                      {t('Close', 'बंद करें')}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ComboBookingModal;
