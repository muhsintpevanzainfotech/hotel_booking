import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Mail, Phone, Users, MessageSquare, AlertCircle, MapPin, Hash, DollarSign, BookmarkCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import useSEO from '../hooks/useSEO';
import sitoutImg from '../assets/images/sitout.jpeg';

const BookingStatus = () => {
    const [reference, setReference] = useState('');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const queryRef = searchParams.get('ref');

    useSEO(
        t('Track Stay Status', 'आरक्षण स्थिति', 'താമസം ട്രാക്ക് ചെയ്യുക'),
        t('Enter your Reservation ID to track checkout, check-in, billing, and room confirmation status at Lake Breeze Resorts.', 'अपना आरक्षण संदर्भ दर्ज करके अपनी बुकिंग स्थिति जानें।')
    );

    useEffect(() => {
        if (queryRef) {
            setReference(queryRef.toUpperCase());
            const fetchByRef = async (refVal) => {
                setLoading(true);
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_BASE}/bookings/reference/${refVal}`);
                    const data = await res.json();
                    if (res.ok) {
                        setBooking(data);
                        toast.success(t('Reservation details retrieved', 'बुकिंग विवरण मिल गया है'));
                    } else {
                        toast.error(data.message || t('Booking not found', 'बुकिंग नहीं मिली'));
                        setBooking(null);
                    }
                } catch (err) {
                    toast.error(t('Connection failed', 'कनेक्शन विफल'));
                } finally {
                    setLoading(false);
                }
            };
            fetchByRef(queryRef.toUpperCase());
        }
    }, [queryRef]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!reference) return;

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/bookings/reference/${reference}`);
            const data = await res.json();
            if (res.ok) {
                setBooking(data);
                toast.success(t('Reservation details retrieved', 'बुकिंग विवरण मिल गया है'));
            } else {
                toast.error(data.message || t('Booking not found', 'बुकिंग नहीं मिली'));
                setBooking(null);
            }
        } catch (err) {
            toast.error(t('Connection failed', 'कनेक्शन विफल'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#F8FAFA] min-h-screen">
            {/* Page Header */}
            <section className="px-4 py-4 md:px-8 md:py-6 bg-white w-full max-w-[1400px] mx-auto">
                <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col justify-center items-center text-center shadow-md">
                    {/* Background image & Overlay */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img
                            src={sitoutImg}
                            alt="Booking Status Banner"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                        {/* Dark green gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/90 via-[#0F4C4C]/80 to-teal-900/60 backdrop-blur-[1px]" />
                    </div>
                    
                    {/* Header Text Content */}
                    <div className="relative z-10 text-white space-y-3 px-4 sm:px-6">
                        <div className="flex items-center justify-center gap-2 text-teal-300 opacity-80">
                            <BookmarkCheck size={16} className="text-teal-300" />
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">{t('Track Stay', 'ट्रैक स्टे', 'ട്രാക്ക് സ്റ്റേ')}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
                            {t('Booking Status', 'बुकिंग की स्थिति', 'ബുക്കിംഗ് സ്റ്റാറ്റസ്')}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-teal-200">
                            <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम', 'ഹോം')}</Link>
                            <span>•</span>
                            <span className="text-white">{t('Booking Status', 'बुकिंग की स्थिति', 'ബുക്കിംഗ് സ്റ്റാറ്റസ്')}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 max-w-[1200px] mx-auto px-6">
                {/* Search Panel */}
                <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-sm border border-gray-100 mb-12">
                    <div className="max-w-2xl mx-auto text-center space-y-8">
                        <h3 className="text-2xl font-bold text-primary">{t('Enter Reference ID', 'संदर्भ आईडी दर्ज करें')}</h3>
                        
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                                <Hash size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="LB-XXXXXXXX" 
                                value={reference}
                                onChange={(e) => setReference(e.target.value.toUpperCase())}
                                className="w-full bg-gray-50 border-none rounded-3xl py-6 pl-16 pr-44 text-xl font-mono text-primary outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-200"
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="absolute right-3 top-3 bottom-3 px-10 bg-neutral-950 text-white rounded-full font-black uppercase text-xs tracking-widest shadow-lg hover:bg-neutral-900 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? t('Searching...', 'खोज हो रही है...') : t('Check Status', 'स्थिति देखें')}
                            </button>
                        </form>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('Example: LB-2024-001', 'उदाहरण: LB-2024-001')}</p>
                    </div>
                </div>

                {/* Result Panel */}
                <AnimatePresence mode="wait">
                    {booking ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Booking Details Card */}
                                <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="p-8 md:p-12 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-gray-50/50">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center text-primary border border-gray-100">
                                                <BookmarkCheck size={32} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('Reservation Reference', 'आरक्षण संदर्भ')}</p>
                                                <p className="text-3xl font-mono font-bold text-primary tracking-tighter">{booking.bookingReference}</p>
                                            </div>
                                        </div>
                                        <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                            booking.status === 'Approved' ? 'bg-green-50 border-green-100 text-green-600' :
                                            booking.status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                            'bg-red-50 border-red-100 text-red-600'
                                        }`}>
                                            {t(booking.status, booking.status === 'Approved' ? 'स्वीकृत' : booking.status === 'Pending' ? 'लंबित' : 'अस्वीकृत')}
                                        </div>
                                    </div>

                                    <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('Check-In', 'चेक-इन')}</p>
                                            <div className="flex items-center gap-3 text-primary font-bold">
                                                <Calendar size={16} className="text-secondary" />
                                                <p className="text-lg">{new Date(booking.checkIn).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('Check-Out', 'चेक-आउट')}</p>
                                            <div className="flex items-center gap-3 text-primary font-bold">
                                                <Calendar size={16} className="text-secondary" />
                                                <p className="text-lg">{new Date(booking.checkOut).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('Accommodation', 'आवास')}</p>
                                            <div className="flex items-center gap-3 text-primary font-bold">
                                                <MapPin size={16} className="text-secondary" />
                                                <p className="text-lg">{booking.room?.name || 'Deluxe Room'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('Guest Name', 'अतिथि का नाम')}</p>
                                            <div className="flex items-center gap-3 text-primary font-bold">
                                                <User size={16} className="text-secondary" />
                                                <p className="text-lg">{booking.guestName}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('Guests', 'अतिथि संख्या')}</p>
                                            <div className="flex items-center gap-3 text-primary font-bold">
                                                <Users size={16} className="text-secondary" />
                                                <p className="text-lg">{booking.adults} {t('Adults', 'वयस्क')}, {booking.children} {t('Children', 'बच्चे')}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('Total Amount', 'कुल राशि')}</p>
                                            <div className="flex items-center gap-3 text-primary font-black">
                                                <DollarSign size={16} className="text-secondary" />
                                                <p className="text-2xl tracking-tighter">₹{booking.totalPrice?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {booking.specialRequests && (
                                        <div className="px-8 pb-12 md:px-12">
                                            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 italic text-sm text-gray-500 relative">
                                                <MessageSquare size={20} className="absolute -top-3 -left-3 text-secondary bg-white p-1 rounded-full border border-gray-100" />
                                                "{booking.specialRequests}"
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Financial Summary Card */}
                                <div className="bg-primary text-white p-12 rounded-[40px] flex flex-col justify-center items-center text-center space-y-8 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
                                    <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center text-teal-400 border border-white/10 backdrop-blur-sm">
                                        <DollarSign size={48} />
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-teal-100/40 uppercase tracking-[0.3em]">{t('Payment Summary', 'भुगतान सारांश')}</p>
                                        <p className={`text-4xl font-black tracking-tight ${booking.paymentStatus === 'Paid' ? 'text-green-400' : 'text-amber-400'}`}>
                                            {t(booking.paymentStatus || 'Unpaid', booking.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid')}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-white/10 w-full">
                                        <p className="text-sm font-medium text-teal-100/60 leading-relaxed italic">
                                            {booking.paymentStatus === 'Paid' ? t('Transaction confirmed successfully.', 'लेनदेन सफलतापूर्वक पूरा हुआ।') : t('Please complete payment at the resort.', 'कृपया रिसॉर्ट पर भुगतान पूरा करें।')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-white border border-gray-100 rounded-[32px] flex items-start gap-6 shadow-sm">
                                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                                    <AlertCircle size={24} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t('Important Assistance', 'महत्वपूर्ण सहायता')}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                        {t('To modify or cancel your stay, please contact our concierge team at +91 98765 43210 with your reference ID LB-XXXXXXXX. We recommend doing this at least 48 hours prior to check-in.', 'अपनी बुकिंग बदलने के लिए, कृपया हमारी टीम से संपर्क करें।')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        !loading && reference.length > 5 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 space-y-6"
                            >
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                    <AlertCircle size={40} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xl font-bold text-gray-400">{t('Sanctuary Not Found', 'अभयारण्य नहीं मिला')}</p>
                                    <p className="text-sm text-gray-400 max-w-xs mx-auto">{t('Please double check your reference ID and try again.', 'कृपया अपनी आईडी की दोबारा जांच करें और पुनः प्रयास करें।')}</p>
                                </div>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default BookingStatus;
