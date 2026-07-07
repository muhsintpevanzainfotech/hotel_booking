import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Users, Sparkles, Check, Calendar, User, Mail, Phone, CheckCircle, ChevronRight, ArrowLeft, Tag } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../utils/imageHelper';
import useSEO from '../hooks/useSEO';
import { calculateDiscountAmount, validatePromoCode } from '../utils/promoHelper';
import roomImg from '../assets/images/room.jpeg';
import coupleImg from '../assets/images/couple.jpeg';
import familyImg from '../assets/images/family.jpeg';
import roomsImg from '../assets/images/rooms.jpeg';
import bathroomImg from '../assets/images/bathroom.jpeg';
import logoLandscape from '../assets/LOGO LANDSCAPE.png';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PackageDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(null);
    const [formData, setFormData] = useState({
        guestName: '',
        email: '',
        phone: '',
        checkIn: null,
        checkOut: null,
        adults: 2,
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

    // Fetch room/combo details on mount/id change
    useEffect(() => {
        const fetchPackage = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE}/rooms/${id}`);
                const data = await res.json();
                if (res.ok) {
                    // Check if it's actually NOT a package, redirect to room details
                    if (data && !Array.isArray(data.includes)) {
                        navigate(`/rooms/${id}`, { replace: true });
                        return;
                    }
                    setRoom(data);
                } else {
                    setError(data.message || t('Package not found', 'पैकेज नहीं मिला'));
                }
            } catch (err) {
                setError(t('Connection failed', 'कनेक्शन विफल'));
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id, t, navigate]);

    // Reset states if package changes
    useEffect(() => {
        setActiveIndex(0);
        setIsSubmitting(false);
        setBookingSuccess(null);
        setFormData({
            guestName: '',
            email: '',
            phone: '',
            checkIn: null,
            checkOut: null,
            adults: 2,
            specialRequests: ''
        });
        setPromoInput('');
        setAppliedPromo(null);
        setPromoError('');
        setPromoDiscount(0);
        setTotalPrice(0);
    }, [room]);

    useEffect(() => {
        if (room) {
            const originalTotal = room.price;
            if (appliedPromo) {
                const disc = calculateDiscountAmount(appliedPromo.discount, originalTotal);
                setPromoDiscount(disc);
                setTotalPrice(originalTotal - disc);
            } else {
                setPromoDiscount(0);
                setTotalPrice(originalTotal);
            }
        }
    }, [room, appliedPromo]);

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

    const titleLower = useMemo(() => (room?.title || room?.name || '').toLowerCase(), [room]);
    const typeLower = useMemo(() => (room?.type || '').toLowerCase(), [room]);

    // 1. Determine Duration
    const duration = useMemo(() => {
        if (!room) return '';
        if (titleLower.includes('weekend') || typeLower.includes('weekend')) {
            return t('3 Days / 2 Nights', '3 दिन / 2 रात');
        } else if (titleLower.includes('honeymoon') || titleLower.includes('romantic') || titleLower.includes('couple')) {
            return t('4 Days / 3 Nights', '4 दिन / 3 रात');
        } else if (titleLower.includes('extended') || titleLower.includes('wellness') || titleLower.includes('nature')) {
            return t('5 Days / 4 Nights', '5 दिन / 4 रात');
        }
        return t('3 Days / 2 Nights', '3 दिन / 2 रात');
    }, [room, titleLower, typeLower, t]);

    // 2. Determine Guest Capacity
    const capacity = useMemo(() => {
        if (!room) return '';
        if (titleLower.includes('family') || titleLower.includes('group') || typeLower.includes('group')) {
            return t('Up to 4 Guests', '4 अतिथियों तक');
        } else if (titleLower.includes('romantic') || titleLower.includes('couple') || titleLower.includes('honeymoon')) {
            return t('2 Adults', '2 वयस्क');
        }
        return t('2 Adults & 1 Child', '2 वयस्क और 1 बच्चा');
    }, [room, titleLower, t]);

    const packageNights = useMemo(() => {
        if (!duration) return 2;
        const durationStr = duration.toLowerCase();
        const match = durationStr.match(/(\d+)\s*night/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
        return 2;
    }, [duration]);

    // Calculate check-out date automatically based on check-in date and duration nights
    const handleDateChange = (name, date) => {
        setFormData(prev => {
            const next = { ...prev, [name]: date };
            if (name === 'checkIn' && date) {
                const checkOutDate = new Date(date);
                checkOutDate.setDate(checkOutDate.getDate() + packageNights);
                next.checkOut = checkOutDate;
            }
            return next;
        });
    };

    // Curated highlights and activities
    const comboDetails = useMemo(() => {
        if (!room) return null;

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

        const activities = [
            t('Sunrise Yoga & Meditation', 'सूर्योदय योग और ध्यान'),
            t('Traditional Kerala Cooking Masterclass', 'केरल कुकिंग मास्टरक्लास'),
            t('Sunset Backwater Canoe Cruise', 'सूर्यास्त बोट क्रूज़'),
            t('Estate Guided Heritage Walk', 'गाइडेड हेरिटेज वॉक')
        ];

        const terms = [
            t('Rates are subject to 18% GST.', 'दरें 18% जीएसटी के अधीन हैं।'),
            t('A 50% advance deposit is required to confirm reservation.', 'बुकिंग की पुष्टि के लिए 50% अग्रिम जमा आवश्यक है।'),
            t('Free cancellation up to 7 days prior to check-in date.', 'आगमन से 7 दिन पहले तक मुफ्त रद्दीकरण उपलब्ध है।'),
            t('Resort Check-in is 2:00 PM; Check-out is 11:00 AM.', 'चेक-इन दोपहर 2:00 बजे है; चेक-आउट सुबह 11:00 बजे है।')
        ];

        return {
            highlights,
            activities,
            terms
        };
    }, [room, titleLower, t]);

    // Construct image gallery
    const roomImages = useMemo(() => {
        if (!room) return [];
        let list = [];
        if (room.images && room.images.length > 0) {
            list = room.images.map(img => ({
                url: img.url || img,
                category: img.category || 'Package View',
                isLocal: false
            }));
        } else if (room.coverImage) {
            list = [{
                url: room.coverImage,
                category: 'Cover',
                isLocal: false
            }];
        }
        return list;
    }, [room]);

    const getDisplayImageUrl = (imgObj) => {
        if (!imgObj) return roomImg;
        if (imgObj.isLocal) return imgObj.localAsset;
        return getImageUrl(imgObj.url || imgObj);
    };

    useSEO(
        room ? room.title : t('Exquisite Experience Details', 'पैकेज का विवरण'),
        room ? room.description : t('Explore and submit inquiry for our curated luxury package deals at Lake Breeze Resorts.', 'क्यूरेटेड पैकेज विवरण देखें और पूछताछ भेजें।')
    );

    if (loading) {
        return (
            <div className="bg-[#F8FAFA] min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-[#0F4C4C] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs uppercase font-black tracking-widest text-[#0F4C4C]">{t('Loading Package...', 'पैकेज लोड हो रहा है...')}</p>
                </div>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="bg-[#F8FAFA] min-h-screen flex items-center justify-center p-6">
                <div className="text-center space-y-6 max-w-sm">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <ArrowLeft size={36} />
                    </div>
                    <h2 className="text-2xl font-black text-[#0F4C4C] tracking-tight">{error || t('Package Not Found', 'पैकेज नहीं मिला')}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {t('The exquisite package you are looking for might have been archived. Please explore our other resort experiences.', 'वह पैकेज उपलब्ध नहीं है। कृपया हमारे अन्य विकल्प देखें।')}
                    </p>
                    <Link to="/rooms" className="inline-block px-10 py-4 bg-[#0F4C4C] text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#2E7D7D] transition-all active:scale-95 shadow-md">
                        {t('Back to Marketplace', 'मार्केटप्लेस पर वापस जाएं')}
                    </Link>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.checkIn || !formData.checkOut) {
            return toast.error(t('Please select check-in date', 'कृपया आगमन तिथि चुनें'));
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
                    adults: formData.adults,
                    children: 0,
                    specialRequests: formData.specialRequests,
                    room: room._id,
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

    return (
        <div className="bg-[#F8FAFA] min-h-screen font-poppins pb-24">
            {/* Header section with breadcrumbs and background banner */}
            <section className="px-4 py-4 md:px-8 md:py-6 bg-white w-full max-w-[1400px] mx-auto">
                <div className="relative h-[180px] sm:h-[220px] rounded-[24px] sm:rounded-[32px] overflow-hidden flex flex-col justify-center items-center text-center shadow-md">
                    {/* Background image & Overlay */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img
                            src={room.coverImage ? getImageUrl(room.coverImage) : roomImg}
                            alt={room.title}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/90 via-[#0F4C4C]/80 to-teal-900/60 backdrop-blur-[1px]" />
                    </div>
                    
                    {/* Header Text Content */}
                    <div className="relative z-10 text-white space-y-2 px-4 sm:px-6">
                        <div className="flex items-center justify-center gap-2 text-teal-300 opacity-80">
                            <Star size={14} className="text-teal-300 fill-teal-300" />
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em]">
                                {t('Exquisite Experience', 'उत्कृष्ट अनुभव')}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-none text-white">
                            {room.title}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-teal-200">
                            <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम')}</Link>
                            <span>•</span>
                            <Link to="/rooms" className="hover:text-white transition-colors">{t('Rooms & Experiences', 'कमरे और अनुभव')}</Link>
                            <span>•</span>
                            <span className="text-white truncate max-w-[150px]">{room.title}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back button and main container */}
            <div className="max-w-[1200px] mx-auto px-6 pt-8">
                <button 
                    onClick={() => navigate('/rooms')} 
                    className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#0F4C4C] transition-colors uppercase tracking-widest mb-8 cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    {t('Back to Marketplace', 'मार्केटप्लेस पर वापस जाएं')}
                </button>

                {/* Split Two-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    
                    {/* Left Column: Image Gallery & Details */}
                    <div className="w-full lg:w-[58%] space-y-8">
                        
                        {/* Swiper Gallery Card */}
                        <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
                            {roomImages.length > 0 ? (
                                <div className="flex flex-col w-full">
                                    {/* Big Main Image */}
                                    <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden select-none bg-black">
                                        <AnimatePresence mode="wait">
                                            <motion.img 
                                                key={activeIndex}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                src={getDisplayImageUrl(roomImages[activeIndex])} 
                                                alt={`${room.title} view`} 
                                                className="w-full h-full object-cover absolute inset-0"
                                            />
                                        </AnimatePresence>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                        
                                        {roomImages[activeIndex]?.category && (
                                            <span className="absolute bottom-6 left-6 px-3.5 py-1.5 bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                                                {roomImages[activeIndex].category}
                                            </span>
                                        )}
                                    </div>

                                    {/* Thumbnail Swiper */}
                                    {roomImages.length > 1 && (
                                        <div className="p-4 bg-white border-t border-gray-55 w-full">
                                            <Swiper
                                                modules={[Navigation]}
                                                navigation
                                                spaceBetween={10}
                                                slidesPerView={4}
                                                className="w-full select-none"
                                            >
                                                {roomImages.map((image, index) => {
                                                    const isActive = index === activeIndex;
                                                    return (
                                                        <SwiperSlide key={index}>
                                                            <button 
                                                                onClick={() => setActiveIndex(index)}
                                                                className={`w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all relative block cursor-pointer ${
                                                                    isActive 
                                                                        ? 'border-[#0F4C4C] scale-[0.98]' 
                                                                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]'
                                                                }`}
                                                            >
                                                                <img 
                                                                    src={getDisplayImageUrl(image)} 
                                                                    alt="thumbnail" 
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </button>
                                                        </SwiperSlide>
                                                    );
                                                })}
                                            </Swiper>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-[300px] sm:h-[400px] flex flex-col items-center justify-center bg-[#FAF6F0] p-8 select-none text-center">
                                    <img 
                                        src={logoLandscape} 
                                        alt="Lake Breeze Resort Logo" 
                                        className="h-14 sm:h-20 w-auto object-contain opacity-75 mb-4" 
                                    />
                                    <p className="text-[#0F4C4C] text-[10px] font-black uppercase tracking-widest bg-[#0F4C4C]/5 px-3 py-1 rounded-full">
                                        {t('Package Image Not Available', 'पैकेज छवि उपलब्ध नहीं है')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Sanctuary Specifications Details */}
                        <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm bg-teal-50 border border-teal-100 text-[#0F4C4C]">
                                        {t('Curated Package', 'क्यूरेटेड पैकेज')}
                                    </span>
                                    <div className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 border border-teal-100 rounded-xl text-[#0F4C4C]">
                                        <Star size={12} className="fill-teal-700 text-teal-700" />
                                        <span className="text-[10px] font-black">4.9</span>
                                    </div>
                                </div>
                                
                                <h2 className="text-3xl font-black text-[#0F4C4C] tracking-tight leading-tight">
                                    {room.title}
                                </h2>

                                <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-1">
                                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#2E7D7D]" /> Mavoor, Kerala</span>
                                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#2E7D7D]" /> {duration}</span>
                                    <span className="flex items-center gap-1.5"><Users size={12} className="text-[#2E7D7D]" /> {capacity}</span>
                                </div>
                            </div>

                            {/* Standard Rate Details */}
                            <div className="p-5 bg-[#F8FAFA] rounded-3xl border border-gray-55 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('Rate details', 'दर विवरण')}</p>
                                    <p className="text-xs font-bold text-gray-500">{t('All-Inclusive Package Rate', 'सर्व-समावेशी पैकेज दर')}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-[#0F4C4C] tracking-tighter">₹{room.price.toLocaleString()}</span>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none">{t('per package', 'प्रति पैकेज')}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">
                                    {t('About the Experience', 'इस अनुभव के बारे में')}
                                </h4>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    {room.description || t('No description available for this luxury experience.', 'विवरण अनुपलब्ध है।')}
                                </p>
                            </div>

                            {/* Package Inclusions */}
                            {room.includes && room.includes.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Package Inclusions', 'पैकेज में शामिल')}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {room.includes.map((inc, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5 p-3.5 bg-[#F8FAFA] border border-gray-55 rounded-2xl">
                                                <Check size={14} className="text-[#2E7D7D] shrink-0 mt-0.5" />
                                                <span className="text-xs font-bold text-gray-600">{inc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Signature Activities */}
                            {comboDetails && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Signature Activities', 'विशेष गतिविधियां')}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {comboDetails.activities.map((act, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3.5 bg-[#F8FAFA] border border-gray-55 rounded-2xl">
                                                <div className="w-2.5 h-2.5 bg-teal-500/20 rounded-full flex items-center justify-center shrink-0">
                                                    <div className="w-1.5 h-1.5 bg-[#2E7D7D] rounded-full" />
                                                </div>
                                                <span className="text-xs font-bold text-gray-600">{act}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Terms & Conditions */}
                            {comboDetails?.terms && (
                                <div className="space-y-3 border-t border-gray-100 pt-6">
                                    <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Terms & Conditions', 'नियम और शर्तें')}</h4>
                                    <ul className="space-y-2 text-xs text-gray-500 font-semibold leading-relaxed">
                                        {comboDetails.terms.map((term, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-[#2E7D7D] font-bold">•</span>
                                                <span>{term}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sticky Enquiry Panel */}
                    <div className="w-full lg:w-[42%] bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm sticky top-24">
                        {!bookingSuccess ? (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <h3 className="text-xl font-black text-[#0F4C4C] tracking-tight">
                                        {t('Reserve Package', 'पैकेज बुक करें')}
                                    </h3>
                                    <p className="text-gray-400 text-[11px] leading-relaxed">
                                        {t('Select your travel dates and details below to reserve your signature package.', 'अपना सिग्नेचर पैकेज रिज़र्व करने के लिए नीचे अपनी यात्रा की तिथियां और विवरण चुनें।')}
                                    </p>
                                </div>

                                {/* Enquiry Form (Single Step) */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Check In', 'आगमन')}</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors z-10" size={15} />
                                                <DatePicker
                                                    selected={formData.checkIn}
                                                    onChange={(date) => handleDateChange('checkIn', date)}
                                                    className="w-full pl-12 pr-4 py-3 bg-[#F8FAFA] border border-gray-100 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                    placeholderText={t('Select Date', 'तिथि चुनें')}
                                                    minDate={new Date()}
                                                    dateFormat="dd/MM/yyyy"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Check Out', 'प्रस्थान')}</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors z-10" size={15} />
                                                <DatePicker
                                                    selected={formData.checkOut}
                                                    onChange={(date) => handleDateChange('checkOut', date)}
                                                    className="w-full pl-12 pr-4 py-3 bg-[#F8FAFA] border border-gray-100 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                    placeholderText={t('Select Date', 'तिथि चुनें')}
                                                    minDate={formData.checkIn || new Date()}
                                                    dateFormat="dd/MM/yyyy"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Guests Count', 'अतिथि संख्या')}</label>
                                        <select 
                                            name="adults" 
                                            value={formData.adults} 
                                            onChange={handleInputChange}
                                            className="w-full bg-[#F8FAFA] border border-gray-100 rounded-2xl p-3 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} {n === 1 ? t('Guest', 'अतिथि') : t('Guests', 'अतिथि')}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Full Name', 'पूरा नाम')}</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={15} />
                                            <input 
                                                type="text" 
                                                name="guestName" 
                                                value={formData.guestName} 
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 bg-[#F8FAFA] border border-gray-100 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Email', 'ईमेल')}</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={15} />
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    value={formData.email} 
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-4 py-3 bg-[#F8FAFA] border border-gray-100 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                    placeholder="john@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Phone', 'फ़ोन')}</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={15} />
                                                <input 
                                                    type="tel" 
                                                    name="phone" 
                                                    value={formData.phone} 
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-4 py-3 bg-[#F8FAFA] border border-gray-100 rounded-2xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                    placeholder="+91 00000 00000"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Special Requests', 'विशेष अनुरोध')}</label>
                                        <textarea 
                                            name="specialRequests" 
                                            value={formData.specialRequests} 
                                            onChange={handleInputChange}
                                            className="w-full bg-[#F8FAFA] border border-gray-100 rounded-2xl p-3 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] h-16 resize-none outline-none transition-all"
                                            placeholder={t('Anything we should know?', 'कुछ भी जो हमें जानना चाहिए?')}
                                        ></textarea>
                                    </div>

                                    {/* Promo Code Integration */}
                                    <div className="space-y-2 bg-[#F8FAFA] p-4 rounded-[20px] border border-gray-100">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 flex items-center gap-1.5">
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
                                                className="flex-grow px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] outline-none transition-all uppercase placeholder:normal-case disabled:opacity-60"
                                            />
                                            {appliedPromo ? (
                                                <button 
                                                    type="button" 
                                                    onClick={handleRemovePromo}
                                                    className="px-4 py-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 cursor-pointer shrink-0"
                                                >
                                                    {t('Remove', 'हटाएं')}
                                                </button>
                                            ) : (
                                                <button 
                                                    type="button" 
                                                    onClick={handleApplyPromo}
                                                    className="px-4 py-2.5 bg-[#0F4C4C] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#2E7D7D] transition-all active:scale-95 cursor-pointer shrink-0"
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

                                    <div className="flex items-start gap-3 p-3 bg-[#F8FAFA] rounded-2xl border border-gray-100 group">
                                        <input 
                                            type="checkbox" 
                                            id="terms"
                                            required
                                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#0F4C4C] focus:ring-[#0F4C4C] cursor-pointer"
                                        />
                                        <label htmlFor="terms" className="text-[9px] text-gray-500 leading-relaxed cursor-pointer select-none">
                                            {t('I agree to the', 'मैं सहमत हूँ')} <Link to="/terms-conditions" target="_blank" className="text-[#0F4C4C] font-bold underline hover:text-[#2E7D7D] transition-colors">{t('Terms & Conditions', 'नियम और शर्तें')}</Link> {t('and', 'और')} <Link to="/privacy-policy" target="_blank" className="text-[#0F4C4C] font-bold underline hover:text-[#2E7D7D] transition-colors">{t('Privacy Policy', 'गोपनीयता नीति')}</Link> {t('of Lake Breeze Resorts.', 'लेक ब्रीज का।')}
                                        </label>
                                    </div>

                                    {/* Calculated Price */}
                                    <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 flex flex-col gap-2.5 text-[#0F4C4C]">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-[#2E7D7D]">{t('Calculated Price', 'कुल अनुमानित राशि')}</p>
                                                <p className="text-[9px] font-bold text-gray-550">
                                                    {t('All-Inclusive Package', 'सर्व-समावेशी पैकेज')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-black tracking-tighter">₹{totalPrice.toLocaleString()}</span>
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none">{t('Total', 'कुल')}</span>
                                            </div>
                                        </div>
                                        {appliedPromo && promoDiscount > 0 && (
                                            <div className="flex flex-col gap-1 border-t border-[#0F4C4C]/10 pt-2 text-[9px] font-bold uppercase tracking-wider text-slate-550">
                                                <div className="flex justify-between">
                                                    <span>{t('Original Rate', 'मूल दर')}</span>
                                                    <span>₹{room.price.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-emerald-600">
                                                    <span>{t('Discount Amount', 'छूट राशि')}</span>
                                                    <span>-₹{promoDiscount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="btn-book-now w-full py-3.5 text-[10px] cursor-pointer"
                                    >
                                        {isSubmitting ? t('Processing...', 'प्रक्रिया...') : (
                                            <span className="flex items-center justify-center gap-2">
                                                {t('Confirm Package', 'पुष्टि करें')}
                                                <ChevronRight size={14} />
                                            </span>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* Enquiry Confirmation Details */
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6 space-y-6 flex flex-col justify-center items-center"
                            >
                                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm shrink-0">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-black text-[#0F4C4C] tracking-tight leading-tight">
                                    {t('Package Reserved!', 'पैकेज बुकिंग पक्की हो गई!')}
                                </h3>
                                <p className="text-gray-550 text-xs max-w-sm leading-relaxed">
                                    <span>{t('Your booking for ', 'आपका बुकिंग ')} <span className="text-[#0F4C4C] font-bold">{room.title}</span> {t('has been successfully submitted. A confirmation email has been sent to you.', 'सफलतापूर्वक प्राप्त हो गई है। आपको एक ईमेल भेजा गया है।')}</span>
                                </p>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-block relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#0F4C4C] text-white rounded-full text-[7px] font-black uppercase tracking-[0.4em]">{t('Booking ID', 'बुकिंग आईडी')}</div>
                                    <p className="text-lg font-mono font-bold text-[#0F4C4C] tracking-tighter">{bookingSuccess.bookingReference}</p>
                                </div>
                                <div className="pt-4 w-full">
                                    <button 
                                        onClick={() => navigate('/rooms')} 
                                        className="btn-book-now w-full py-4 text-[10px] cursor-pointer"
                                    >
                                      {t('Dismiss', 'बंद करें')}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetails;
