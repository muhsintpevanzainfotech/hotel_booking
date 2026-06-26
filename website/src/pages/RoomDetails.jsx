import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Users, Sparkles, Coffee, Wifi, Check, BedDouble, Calendar, User, Mail, Phone, CheckCircle, ChevronRight, ArrowLeft, Tag } from 'lucide-react';
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

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RoomDetails = () => {
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
        children: 0,
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

    // Fetch room details on mount/id change
    useEffect(() => {
        const fetchRoom = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE}/rooms/${id}`);
                const data = await res.json();
                if (res.ok) {
                    // Check if it's actually a package, if so, redirect to packages page
                    if (data && Array.isArray(data.includes)) {
                        navigate(`/packages/${id}`, { replace: true });
                        return;
                    }
                    setRoom(data);
                } else {
                    setError(data.message || t('Sanctuary not found', 'अभयारण्य नहीं मिला'));
                }
            } catch (err) {
                setError(t('Connection failed', 'कनेक्शन विफल'));
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id, t, navigate]);

    // Reset states if room changes
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
            children: 0,
            specialRequests: ''
        });
        setTotalPrice(0);
        setPromoInput('');
        setAppliedPromo(null);
        setPromoError('');
        setPromoDiscount(0);
    }, [room]);

    // Calculate total price when dates are selected
    useEffect(() => {
        if (room && formData.checkIn && formData.checkOut) {
            const start = new Date(formData.checkIn);
            const end = new Date(formData.checkOut);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            if (days > 0) {
                const basePrice = room.hasDiscount ? room.finalPrice : room.price;
                const originalTotal = days * basePrice;
                if (appliedPromo) {
                    const disc = calculateDiscountAmount(appliedPromo.discount, originalTotal);
                    setPromoDiscount(disc);
                    setTotalPrice(originalTotal - disc);
                } else {
                    setPromoDiscount(0);
                    setTotalPrice(originalTotal);
                }
            } else {
                setTotalPrice(0);
                setPromoDiscount(0);
            }
        }
    }, [formData.checkIn, formData.checkOut, room, appliedPromo]);

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

    const roomPolicies = useMemo(() => {
        return [
            t('Resort Check-in is 2:00 PM; Check-out is 11:00 AM.', 'चेक-इन दोपहर 2:00 बजे है; चेक-आउट सुबह 11:00 बजे है।'),
            t('Government-issued photo ID is required for checking in.', 'चेक-इन के लिए सरकारी पहचान पत्र आवश्यक है।'),
            t('Free cancellation up to 7 days prior to check-in date.', 'आगमन से 7 दिन पहले तक मुफ्त रद्दीकरण उपलब्ध है।'),
            t('Pets are not allowed inside the luxury sanctuary suites.', 'लक्जरी विला और सुइट्स में पालतू जानवर लाने की अनुमति नहीं है।')
        ];
    }, [t]);

    // Construct image gallery
    const roomImages = useMemo(() => {
        if (!room) return [];
        return room.images || [];
    }, [room]);

    const getDisplayImageUrl = (imgObj) => {
        if (!imgObj) return roomImg;
        if (imgObj.isLocal) return imgObj.localAsset;
        return getImageUrl(imgObj.url || imgObj);
    };

    const getDiscountBadgeText = () => {
        if (!room || !room.hasDiscount) return null;
        const type = room.discountType ? String(room.discountType).toLowerCase() : '';
        const val = room.discountValue || 0;
        if (type.includes('percentage') || type.includes('percent')) {
            return `${val}% OFF`;
        }
        if (type.includes('flat') || type.includes('amount')) {
            return `₹${val.toLocaleString('en-IN')} OFF`;
        }
        return null;
    };

    useSEO(
        room ? (room.title || room.name) : t('Luxury Sanctuary Details', 'कमरे का विवरण'),
        room ? room.description : t('Explore the specifications and reserve your stay at Lake Breeze Resorts.', 'कमरे का विवरण देखें और अपनी बुकिंग करें।')
    );

    if (loading) {
        return (
            <div className="bg-[#F8FAFA] min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-[#0F4C4C] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs uppercase font-black tracking-widest text-[#0F4C4C]">{t('Loading Sanctuary...', 'अभयारण्य लोड हो रहा है...')}</p>
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
                    <h2 className="text-2xl font-black text-[#0F4C4C] tracking-tight">{error || t('Sanctuary Not Found', 'अभयारण्य नहीं मिला')}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {t('The exquisite room or experience you are looking for might have been archived. Please explore our other sanctuaries.', 'वह कमरा उपलब्ध नहीं है। कृपया हमारे अन्य विकल्प देखें।')}
                    </p>
                    <Link to="/rooms" className="inline-block px-10 py-4 bg-[#0F4C4C] text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#2E7D7D] transition-all active:scale-95 shadow-md">
                        {t('Back to Rooms', 'कमरों पर वापस जाएं')}
                    </Link>
                </div>
            </div>
        );
    }

    const isAvailable = room.quantity > 0 && room.isAvailable !== false;

    const renderAmenityIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('wifi') || lowerName.includes('internet')) {
            return <Wifi size={14} className="text-[#2E7D7D]" />;
        }
        if (lowerName.includes('coffee') || lowerName.includes('tea') || lowerName.includes('breakfast')) {
            return <Coffee size={14} className="text-[#2E7D7D]" />;
        }
        return <Check size={14} className="text-[#2E7D7D]" />;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.checkIn || !formData.checkOut) {
            return toast.error(t('Please select check-in and check-out dates', 'कृपया चेक-इन और चेक-आउट तिथियां चुनें'));
        }

        setIsSubmitting(true);
        try {
            // Standard Room: submits to /api/book
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    room: room._id,
                    totalPrice,
                    promoCode: appliedPromo ? appliedPromo.code : undefined,
                    discountAmount: promoDiscount
                })
            });

            const data = await response.json();
            if (response.ok) {
                setBookingSuccess(data);
                toast.success(t('Sanctuary reserved successfully!', 'आरक्षण सफलतापूर्वक पूरा हुआ!'));
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
                            src={room.images?.[0]?.url ? getImageUrl(room.images[0].url) : roomImg}
                            alt={room.title || room.name}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/90 via-[#0F4C4C]/80 to-teal-900/60 backdrop-blur-[1px]" />
                    </div>
                    
                    {/* Header Text Content */}
                    <div className="relative z-10 text-white space-y-2 px-4 sm:px-6">
                        <div className="flex items-center justify-center gap-2 text-teal-300 opacity-80">
                            <Star size={14} className="text-teal-300 fill-teal-300" />
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em]">
                                {t('Exquisite Sanctuary', 'उत्कृष्ट अभयारण्य')}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-none text-white">
                            {room.title || room.name}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-teal-200">
                            <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम')}</Link>
                            <span>•</span>
                            <Link to="/rooms" className="hover:text-white transition-colors">{t('Rooms & Experiences', 'कमरे और अनुभव')}</Link>
                            <span>•</span>
                            <span className="text-white truncate max-w-[150px]">{room.title || room.name}</span>
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
                                                alt={`${room.title || room.name} view`} 
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
                                <div className="w-full h-[300px] flex flex-col items-center justify-center text-gray-300 bg-[#F8FAFA]">
                                    <BedDouble size={64} className="mb-4 opacity-50" />
                                    <p className="text-xs uppercase font-black tracking-widest">{t('No Images Configured', 'कोई छवि उपलब्ध नहीं')}</p>
                                </div>
                            )}
                        </div>

                        {/* Sanctuary Specifications Details */}
                        <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm ${
                                        isAvailable 
                                            ? 'bg-green-50 border border-green-100 text-green-700' 
                                            : 'bg-red-50 border border-red-100 text-red-700'
                                    }`}>
                                        {isAvailable 
                                            ? `${room.quantity} ${t('Rooms Available', 'कमरे उपलब्ध')}` 
                                            : t('Sold Out', 'बुक हो गया')
                                        }
                                    </span>
                                    <div className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 border border-teal-100 rounded-xl text-[#0F4C4C]">
                                        <Star size={12} className="fill-teal-700 text-teal-700" />
                                        <span className="text-[10px] font-black">4.9</span>
                                    </div>
                                </div>
                                
                                <h2 className="text-3xl font-black text-[#0F4C4C] tracking-tight leading-tight">
                                    {room.title || room.name}
                                </h2>

                                <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-1">
                                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#2E7D7D]" /> Kumarakom, Kerala</span>
                                    <span className="flex items-center gap-1.5"><Users size={12} className="text-[#2E7D7D]" /> {room.capacity} {t('Guests max', 'अधिकतम अतिथि')}</span>
                                    <span className="flex items-center gap-1.5"><BedDouble size={12} className="text-[#2E7D7D]" /> {room.type}</span>
                                </div>
                            </div>

                            {/* Standard Rate Details */}
                            <div className="p-5 bg-[#F8FAFA] rounded-3xl border border-gray-55 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('Rate details', 'दर विवरण')}</p>
                                    <p className="text-xs font-bold text-gray-500">{t('Standard Rate Plan', 'मानक दर योजना')}</p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    {room.hasDiscount ? (
                                        <>
                                            <span className="text-2xl font-black text-[#0F4C4C] tracking-tighter">₹{room.finalPrice?.toLocaleString()}</span>
                                            <div className="flex items-center gap-2 mt-0.5 justify-end">
                                                <span className="text-xs text-gray-400 line-through">₹{room.price.toLocaleString()}</span>
                                                {getDiscountBadgeText() && (
                                                    <span className="bg-[#0F4C4C] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                                                        {getDiscountBadgeText()}
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-2xl font-black text-[#0F4C4C] tracking-tighter">₹{room.price.toLocaleString()}</span>
                                    )}
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none mt-1">{t('per night', 'प्रति रात')}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">
                                    {t('About this Sanctuary', 'इस अभयारण्य के बारे में')}
                                </h4>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    {room.description || t('No description available for this luxury sanctuary.', 'विवरण अनुपलब्ध है।')}
                                </p>
                            </div>

                            {/* Room Facilities */}
                            {room.facilities && room.facilities.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Integrated Facilities', 'एकीकृत सुविधाएं')}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {room.facilities.map((fac, idx) => (
                                            <div key={fac._id || idx} className="flex items-center gap-3 p-3.5 bg-[#F8FAFA] border border-gray-50 rounded-2xl">
                                                {fac.image ? (
                                                    <img 
                                                        src={getImageUrl(fac.image)} 
                                                        className="w-5 h-5 object-contain opacity-80" 
                                                        alt="" 
                                                    />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-lg bg-teal-50 flex items-center justify-center text-primary">
                                                        <Sparkles size={12} className="text-[#0F4C4C]" />
                                                    </div>
                                                )}
                                                <span className="text-xs font-bold text-gray-600 truncate">{fac.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Room Amenities */}
                            {room.amenities && room.amenities.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Included Services', 'शामिल सेवाएं')}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {room.amenities.map((amenity, idx) => (
                                            <span 
                                                key={idx} 
                                                className="px-3.5 py-2.5 bg-white text-gray-500 text-[10px] font-bold rounded-xl border border-gray-100 uppercase tracking-widest flex items-center gap-2 shadow-sm"
                                            >
                                                {renderAmenityIcon(amenity)}
                                                {t(amenity, amenity)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Policies */}
                            <div className="space-y-3 border-t border-gray-100 pt-6">
                                <h4 className="text-[10px] font-black text-[#0F4C4C] uppercase tracking-widest">{t('Policies & Guidelines', 'नियम और दिशानिर्देश')}</h4>
                                <ul className="space-y-2 text-xs text-gray-500 font-semibold leading-relaxed">
                                    {roomPolicies.map((policy, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-[#2E7D7D] font-bold">•</span>
                                            <span>{policy}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Reservation Panel */}
                    <div className="w-full lg:w-[42%] bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm sticky top-24">
                        {isAvailable ? (
                            !bookingSuccess ? (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-black text-[#0F4C4C] tracking-tight">
                                            {t('Reserve Your Sanctuary', 'आरक्षण करें')}
                                        </h3>
                                        <p className="text-gray-400 text-[11px] leading-relaxed">
                                            {t('Provide your details and stay dates below to request your reservation.', 'अपना विवरण और तिथियां भरकर आरक्षण का अनुरोध करें।')}
                                        </p>
                                    </div>

                                    {/* Booking Form (Single Step) */}
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

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Adults', 'वयस्क')}</label>
                                                <select 
                                                    name="adults" 
                                                    value={formData.adults} 
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#F8FAFA] border border-gray-100 rounded-2xl p-3 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                >
                                                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Children', 'बच्चे')}</label>
                                                <select 
                                                    name="children" 
                                                    value={formData.children} 
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#F8FAFA] border border-gray-100 rounded-2xl p-3 text-xs font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                >
                                                    {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                                                </select>
                                            </div>
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

                                        {/* Total price preview */}
                                        {totalPrice > 0 && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-3.5 bg-teal-50 rounded-2xl border border-teal-100 flex flex-col gap-2.5 text-[#0F4C4C]"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-[#2E7D7D]">{t('Calculated Price', 'कुल अनुमानित राशि')}</p>
                                                        <p className="text-[9px] font-bold text-gray-550">
                                                            {`${t('Stay duration', 'कुल रातें')}: ${Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))} ${t('nights', 'रातें')}`}
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
                                                            <span>{t('Room Rate', 'मूल दर')}</span>
                                                            <span>₹{(totalPrice + promoDiscount).toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between text-emerald-600">
                                                            <span>{t('Discount Amount', 'छूट राशि')}</span>
                                                            <span>-₹{promoDiscount.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="btn-book-now w-full py-3.5 text-[10px] cursor-pointer"
                                        >
                                            {isSubmitting ? t('Processing...', 'प्रक्रिया...') : (
                                                <span className="flex items-center justify-center gap-2">
                                                    {t('Confirm Stay', 'पुष्टि करें')}
                                                    <ChevronRight size={14} />
                                                </span>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                /* Booking Confirmation Details */
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-6 space-y-6 flex flex-col justify-center items-center"
                                >
                                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm shrink-0">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-[#0F4C4C] tracking-tight leading-tight">
                                        {t('Sanctuary Reserved!', 'बुकिंग पक्की हो गई!', 'മുറി റിസർവ് ചെയ്തിരിക്കുന്നു!')}
                                    </h3>
                                    <p className="text-gray-500 text-xs max-w-sm leading-relaxed">
                                        <span>{t('Your stay at', 'आपका प्रवास', 'നിങ്ങളുടെ താമസം')} <span className="text-[#0F4C4C] font-bold">{room.name}</span> {t('has been secured. A confirmation email has been sent to you.', 'पक्का कर लिया गया है। आपको एक ईमेल भेजा गया है।', 'ഉറപ്പാക്കിയിരിക്കുന്നു. ഒരു സ്ഥിരീകരണ ഇമെയിൽ അയച്ചിട്ടുണ്ട്.')}</span>
                                    </p>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-block relative">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#0F4C4C] text-white rounded-full text-[7px] font-black uppercase tracking-[0.4em]">{t('Booking ID', 'आईडी', 'ബുക്കിംഗ് ഐഡി')}</div>
                                        <p className="text-lg font-mono font-bold text-[#0F4C4C] tracking-tighter">{bookingSuccess.bookingReference}</p>
                                    </div>
                                    <div className="pt-4 w-full">
                                        <button 
                                            onClick={() => navigate('/rooms')} 
                                            className="btn-book-now w-full py-4 text-[10px] cursor-pointer"
                                        >
                                          {t('Dismiss', 'बंद करें', 'ശരി')}
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        ) : (
                            /* Sold Out View */
                            <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm">
                                    <ArrowLeft size={32} />
                                </div>
                                <h3 className="text-lg font-black text-[#0F4C4C] uppercase tracking-wider">{t('Room Sold Out', 'कमरा बुक हो चुका है')}</h3>
                                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                                    {t('This luxury sanctuary is temporarily unavailable for reservations. Please browse our other exquisite rooms.', 'यह अभयारण्य अभी बुकिंग के लिए उपलब्ध नहीं है। कृपया हमारी अन्य श्रेणियां देखें।')}
                                </p>
                                <button 
                                    onClick={() => navigate('/rooms')} 
                                    className="w-full py-4 bg-white border border-[#C5A880]/30 text-[#0F4C4C] rounded-full font-semibold uppercase text-[10px] tracking-widest hover:bg-[#FAF6F0] hover:border-[#C5A880] transition-all duration-300 active:scale-95 cursor-pointer"
                                >
                                    {t('Back to Sanctuaries', 'वापस जाएं')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
