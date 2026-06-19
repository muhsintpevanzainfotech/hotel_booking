import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail, Phone, Users, CheckCircle, ChevronRight, BookmarkCheck, Sparkles, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageHelper';


const BookingModal = ({ isOpen, onClose, room }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(null);
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        guestName: '',
        email: '',
        phone: '',
        checkIn: null,
        checkOut: null,
        adults: 1,
        children: 0,
        specialRequests: ''
    });

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (formData.checkIn && formData.checkOut && room) {
            const start = new Date(formData.checkIn);
            const end = new Date(formData.checkOut);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            if (days > 0) {
                setTotalPrice(days * room.price);
            } else {
                setTotalPrice(0);
            }
        }
    }, [formData.checkIn, formData.checkOut, room?.price]);

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
        if (step === 1) {
            if (!formData.checkIn || !formData.checkOut) {
                return toast.error(t('Please select dates', 'कृपया तिथियां चुनें'));
            }
            return setStep(2);
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    room: room._id,
                    totalPrice
                })
            });

            const data = await response.json();
            if (response.ok) {
                setBookingSuccess(data);
            } else {
                toast.error(data.message || t('Booking failed', 'बुकिंग विफल रही'));
            }
        } catch (err) {
            toast.error(t('Network error', 'नेटवर्क त्रुटि'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0F4C4C]/20 backdrop-blur-md" 
                    onClick={onClose}
                ></motion.div>
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 30 }}
                    className="relative w-full max-w-5xl bg-white rounded-[40px] md:rounded-[48px] shadow-[0_50px_100px_-20px_rgba(15,76,76,0.25)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[92vh] max-h-[90vh] border border-white"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-8 z-30 p-2.5 bg-white/95 hover:bg-white text-[#0F4C4C] rounded-full transition-all active:scale-90 shadow-md border border-gray-100">
                        <X size={20} className="text-[#0F4C4C]" />
                    </button>

                    {/* Left Panel: Sanctuary Info */}
                    <div className="w-full md:w-[35%] bg-[#F8FAFA] p-6 md:p-10 lg:p-14 border-b md:border-b-0 md:border-r border-gray-100 flex flex-row md:flex-col justify-between items-center md:items-stretch relative overflow-hidden shrink-0">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#0F4C4C]"></div>
                        <div className="flex md:flex-col items-center md:items-stretch gap-4 md:gap-0 w-full min-w-0">
                            <div className="hidden md:flex items-center gap-2 text-[#2E7D7D] mb-6">
                                <Sparkles size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('Your Sanctuary', 'आपका अभयारण्य')}</span>
                            </div>
                            <img 
                              src={room.images?.[0]?.url ? getImageUrl(room.images[0].url) : '/room_deluxe.png'} 
                              alt={room.name} 
                              className="w-16 h-16 md:w-full md:h-auto md:aspect-[4/3] object-cover rounded-2xl md:rounded-[32px] md:mb-8 shadow-md md:shadow-2xl border-2 md:border-4 border-white shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="text-[8px] md:hidden font-black text-[#2E7D7D] uppercase tracking-widest mb-0.5">{t('Your Sanctuary', 'आपका अभयारण्य')}</p>
                                <h3 className="text-base md:text-3xl font-bold text-[#0F4C4C] tracking-tight truncate md:whitespace-normal md:mb-2">{room.name}</h3>
                                <p className="text-[#2E7D7D] font-black text-xs md:text-xl tracking-tight leading-none">₹{room.price} <span className="text-[10px] md:text-xs font-normal text-gray-400">/ night</span></p>
                            </div>
                            
                            <div className="hidden md:block space-y-6">
                               {[
                                 { icon: <BookmarkCheck size={18} />, label: t('Instant Confirmation', 'तत्काल पुष्टि') },
                                 { icon: <ShieldCheck size={18} />, label: t('Secure Reservation', 'सुरक्षित आरक्षण') }
                               ].map((item, i) => (
                                 <div key={i} className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                   <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-[#0F4C4C] shadow-sm border border-gray-100">{item.icon}</div>
                                   <span>{item.label}</span>
                                 </div>
                               ))}
                            </div>
                        </div>

                        {totalPrice > 0 && (
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="mt-0 md:mt-12 p-3 md:p-8 bg-[#0F4C4C] rounded-2xl md:rounded-3xl text-white shadow-lg md:shadow-2xl relative overflow-hidden shrink-0 ml-auto md:ml-0"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 hidden md:block"></div>
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5 md:mb-2">{t('Total Price', 'कुल राशि')}</p>
                                <p className="text-sm md:text-4xl font-black tracking-tighter">₹{totalPrice.toLocaleString()}</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Panel: Booking Steps */}
                    <div className="w-full md:w-[65%] p-6 md:p-10 lg:p-16 overflow-y-auto no-scrollbar flex-1 min-h-0">
                        {!bookingSuccess ? (
                            <>
                                <div className="mb-8 md:mb-14">
                                    <div className="flex gap-3 mb-6">
                                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= 1 ? 'bg-[#0F4C4C]' : 'bg-gray-100'}`}></div>
                                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= 2 ? 'bg-[#0F4C4C]' : 'bg-gray-100'}`}></div>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-bold text-[#0F4C4C] tracking-tight">{step === 1 ? t('Reserve Your Sanctuary', 'तिथियां चुनें') : t('Guest Information', 'विवरण भरें')}</h2>
                                    <p className="text-gray-400 text-xs md:text-sm mt-2">{step === 1 ? t('Select the dates for your unforgettable Kerala experience.', 'अपने केरल अनुभव के लिए तिथियां चुनें।') : t('Please provide your details to finalize the reservation.', 'आरक्षण पूरा करने के लिए अपना विवरण दें।')}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                                    {step === 1 ? (
                                        <div className="space-y-6 md:space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Check In', 'आगमन')}</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={18} />
                                                        <DatePicker
                                                            selected={formData.checkIn}
                                                            onChange={(date) => handleDateChange('checkIn', date)}
                                                            className="w-full pl-14 pr-6 py-4 md:py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                            placeholderText={t('Select Date', 'तिथि चुनें')}
                                                            minDate={new Date()}
                                                            dateFormat="dd/MM/yyyy"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Check Out', 'प्रस्थान')}</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={18} />
                                                        <DatePicker
                                                            selected={formData.checkOut}
                                                            onChange={(date) => handleDateChange('checkOut', date)}
                                                            className="w-full pl-14 pr-6 py-4 md:py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                            placeholderText={t('Select Date', 'तिथि चुनें')}
                                                            minDate={formData.checkIn || new Date()}
                                                            dateFormat="dd/MM/yyyy"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 md:gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Adults', 'वयस्क')}</label>
                                                    <select 
                                                        name="adults" 
                                                        value={formData.adults} 
                                                        onChange={handleInputChange}
                                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 md:p-5 text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                    >
                                                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Children', 'बच्चे')}</label>
                                                    <select 
                                                        name="children" 
                                                        value={formData.children} 
                                                        onChange={handleInputChange}
                                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 md:p-5 text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                    >
                                                        {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 md:space-y-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Full Name', 'पूरा नाम')}</label>
                                                <div className="relative group">
                                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={18} />
                                                    <input 
                                                        type="text" 
                                                        name="guestName" 
                                                        value={formData.guestName} 
                                                        onChange={handleInputChange}
                                                        className="w-full pl-14 pr-6 py-4 md:py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                        placeholder="John Doe"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Email', 'ईमेल')}</label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={18} />
                                                        <input 
                                                            type="email" 
                                                            name="email" 
                                                            value={formData.email} 
                                                            onChange={handleInputChange}
                                                            className="w-full pl-14 pr-6 py-4 md:py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                            placeholder="john@example.com"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Phone', 'फ़ोन')}</label>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0F4C4C] transition-colors" size={18} />
                                                        <input 
                                                            type="tel" 
                                                            name="phone" 
                                                            value={formData.phone} 
                                                            onChange={handleInputChange}
                                                            className="w-full pl-14 pr-6 py-4 md:py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] transition-all outline-none"
                                                            placeholder="+91 00000 00000"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('Special Requests', 'विशेष अनुरोध')}</label>
                                                <textarea 
                                                    name="specialRequests" 
                                                    value={formData.specialRequests} 
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-50 border-none rounded-3xl p-5 md:p-6 text-sm font-bold text-[#0F4C4C] focus:ring-2 focus:ring-[#0F4C4C] h-24 md:h-32 resize-none outline-none transition-all"
                                                    placeholder={t('Anything we should know?', 'कुछ भी जो हमें जानना चाहिए?')}
                                                ></textarea>
                                            </div>
                                            <div className="flex items-start gap-4 p-5 md:p-6 bg-gray-50 rounded-2xl border border-gray-100 group">
                                                <input 
                                                    type="checkbox" 
                                                    id="terms"
                                                    required
                                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0F4C4C] focus:ring-[#0F4C4C] cursor-pointer"
                                                />
                                                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
                                                    {t('I agree to the', 'मैं सहमत हूँ')} <Link to="/terms-conditions" target="_blank" className="text-[#0F4C4C] font-bold underline hover:text-[#2E7D7D] transition-colors">{t('Terms & Conditions', 'नियम और शर्तें')}</Link> {t('and', 'और')} <Link to="/privacy-policy" target="_blank" className="text-[#0F4C4C] font-bold underline hover:text-[#2E7D7D] transition-colors">{t('Privacy Policy', 'गोപനീയത നയം')}</Link> {t('of Lake Breeze Resorts.', 'ലെക്ക് ബ്രീസ് റിസോർട്ടിന്റെ.')}
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-6 md:pt-10 flex gap-6">
                                        {step === 2 && (
                                            <button 
                                                type="button" 
                                                onClick={() => setStep(1)}
                                                className="flex-1 py-4 bg-white border border-[#C5A880]/30 text-[#0F4C4C] rounded-full font-semibold uppercase text-xs tracking-widest hover:bg-[#FAF6F0] hover:border-[#C5A880] transition-all duration-300 active:scale-95 cursor-pointer"
                                            >
                                                {t('Back', 'पीछे')}
                                            </button>
                                        )}
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="btn-book-now flex-1 py-4 text-xs cursor-pointer"
                                        >
                                            {isSubmitting ? t('Processing...', 'प्रक्रिया...') : (
                                                <span className="flex items-center justify-center gap-3">
                                                    {step === 1 ? t('Continue', 'जारी रखें') : t('Confirm Stay', 'पुष्टि करें')}
                                                    <ChevronRight size={18} />
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6 md:py-16 space-y-6 md:space-y-10"
                            >
                                <div className="w-16 h-16 md:w-28 md:h-28 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-10 shadow-sm shrink-0">
                                    <CheckCircle size={32} className="md:w-14 md:h-14" />
                                </div>
                                <h2 className="text-2xl md:text-5xl font-black text-[#0F4C4C] tracking-tight leading-tight">{t('Sanctuary Reserved!', 'बुकिंग पक्की हो गई!', 'മുറി റിസർവ് ചെയ്തിരിക്കുന്നു!')}</h2>
                                <p className="text-gray-400 text-sm md:text-lg max-w-sm mx-auto leading-relaxed">
                                    {t('Your stay at', 'आपका प्रवास', 'നിങ്ങളുടെ താമസം')} <span className="text-[#0F4C4C] font-bold">{room.name}</span> {t('has been secured. A confirmation email has been sent to you.', 'पक्का कर लिया गया है। आपको एक ईमेल भेजा गया है।', 'ഉറപ്പാക്കിയിരിക്കുന്നു. ഒരു സ്ഥിരീകരണ ഇമെയിൽ അയച്ചിട്ടുണ്ട്.')}
                                </p>
                                <div className="p-6 md:p-10 bg-gray-50 rounded-[28px] md:rounded-[40px] border border-gray-100 inline-block mt-4 md:mt-8 relative group">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0F4C4C] text-white rounded-full text-[8px] font-black uppercase tracking-[0.4em]">{t('Booking ID', 'आईडी', 'ബുക്കിംഗ് ഐഡി')}</div>
                                    <p className="text-xl md:text-3xl font-mono font-bold text-[#0F4C4C] tracking-tighter">{bookingSuccess.bookingReference}</p>
                                </div>
                                <div className="pt-6 md:pt-16">
                                    <button onClick={onClose} className="btn-book-now px-10 md:px-14 py-4 md:py-5 text-xs cursor-pointer">
                                      {t('Dismiss', 'बंद करें', 'ശരി')}
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

export default BookingModal;
