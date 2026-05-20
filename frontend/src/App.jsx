import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginRequest, verifyOtpRequest, checkAuth, updateProfileSuccess } from './redux/slices/authSlice';
import { toggleTheme } from './redux/slices/themeSlice';
import { fetchStatsRequest, fetchAnalyticsRequest } from './redux/slices/statsSlice';
import { fetchRoomsRequest } from './redux/slices/roomSlice';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import StatCard from './components/dashboard/StatCard';
import { BookingChart, RevenueChart } from './components/dashboard/BookingChart';
import RecentBookings from './components/dashboard/RecentBookings';
import RoomManager from './components/dashboard/RoomManager';
import ContentItemManager from './components/dashboard/ContentItemManager';
import GalleryManager from './components/dashboard/GalleryManager';
import EnquiryManager from './components/dashboard/EnquiryManager';
import UserManager from './components/dashboard/UserManager';
import { SiteSettings, SocialManager } from './components/dashboard/SettingsManager';
import LoginView from './components/dashboard/LoginView';
import LoadingScreen from './components/dashboard/LoadingScreen';
import Placeholder from './components/dashboard/Placeholder';
import RightPanel from './components/dashboard/RightPanel';
import AvailabilityCalendar from './components/dashboard/AvailabilityCalendar';
import PriorityActionHub from './components/dashboard/PriorityActionHub';
import { Badge, Button, Modal, CustomSelect, Switch } from './components/common/UIComponents';
import { Toaster } from 'react-hot-toast';
import { 
  Briefcase, 
  CalendarCheck,
  DollarSign,
  BedDouble,
  Clock,
  Layout,
  CalendarDays,
  Ticket,
  User,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';


const FacilitiesManager = ({ apiBase }) => <ContentItemManager type="facilities" apiBase={apiBase} />;
const BannerManager = ({ apiBase }) => <ContentItemManager type="banners" apiBase={apiBase} />;
const OfferManager = ({ apiBase }) => <ContentItemManager type="offers" apiBase={apiBase} />;
const AvailabilityManager = ({ apiBase }) => <AvailabilityCalendar apiBase={apiBase} />;

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading, user, otpRequired, tempUser } = useSelector(state => state.auth);
  const { data: stats } = useSelector(state => state.stats);
  const { isDarkMode } = useSelector(state => state.theme);
  
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [otp, setOtp] = useState('');
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const activeTab = location.pathname.split('/')[1] || 'dashboard';
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchStatsRequest());
      dispatch(fetchAnalyticsRequest());
      dispatch(fetchRoomsRequest());
      fetchDashboardData();
    }
  }, [isAuthenticated, dispatch]);

  const fetchDashboardData = async () => {
    try {
      const [banRes, offRes] = await Promise.all([
        fetch(`${API_BASE}/banners`),
        fetch(`${API_BASE}/offers`)
      ]);
      if (banRes.ok) setBanners(await banRes.json());
      if (offRes.ok) setOffers(await offRes.json());
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginRequest(loginData));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyOtpRequest({ username: tempUser?.username, otp }));
  };

  if (authLoading && !isAuthenticated) return <LoadingScreen />;
  if (!isAuthenticated) return (
    <LoginView 
      loginData={loginData} 
      setLoginData={setLoginData} 
      handleLogin={handleLogin}
      otpRequired={otpRequired}
      otp={otp}
      setOtp={setOtp}
      handleVerifyOtp={handleVerifyOtp}
      tempUser={tempUser}
    />
  );

  return (
    <div className="flex min-h-screen bg-bg-luxury overflow-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--card-luxury)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.02em',
          },
          success: {
            iconTheme: {
              primary: 'var(--primary)',
              secondary: 'var(--text-primary)',
            },
          },
          error: {
            iconTheme: {
              primary: '#F43F5E',
              secondary: 'var(--text-primary)',
            },
          },
        }}
      />
      {/* Sidebar - Fixed Left */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {/* Main Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isOpen ? 'lg:ml-[240px]' : 'lg:ml-[72px]'}`}>
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="section-container w-full max-w-[1280px] mx-auto px-[24px] py-[24px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[24px]">
                      <div className="space-y-[24px] min-w-0">
                        <WelcomeSection user={user} stats={stats} />
                        <BannerSection banners={banners} />
                        <StatsGrid stats={stats} />
                        <EntityInventory stats={stats} />
                        <PriorityActionHub apiBase={API_BASE} />
                        <OfferSection offers={offers} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                          <BookingChart />
                          <RevenueChart />
                        </div>
                        <RecentBookings apiBase={API_BASE} role="Admin" />
                      </div>
                      <div className="space-y-[24px] min-w-0">
                        <RightPanel apiBase={API_BASE} />
                      </div>
                    </div>
                  } />
                  <Route path="/bookings" element={<RecentBookings role="Admin" apiBase={API_BASE} />} />
                  <Route path="/rooms" element={<RoomManager apiBase={API_BASE} />} />
                  <Route path="/blogs" element={<ContentItemManager type="blogs" apiBase={API_BASE} />} />
                  <Route path="/gallery" element={<GalleryManager apiBase={API_BASE} />} />
                  <Route path="/enquiries" element={<EnquiryManager apiBase={API_BASE} type="enquiry" title="Guest Enquiries" />} />
                  <Route path="/contact_messages" element={<EnquiryManager apiBase={API_BASE} type="contact" title="Contact Messages" />} />
                  <Route path="/testimonials" element={<ContentItemManager type="testimonials" apiBase={API_BASE} />} />
                  <Route path="/settings" element={<SiteSettings apiBase={API_BASE} />} />
                  <Route path="/social" element={<SocialManager apiBase={API_BASE} />} />
                  <Route path="/facilities" element={<FacilitiesManager apiBase={API_BASE} />} />
                  <Route path="/banners" element={<BannerManager apiBase={API_BASE} />} />
                  <Route path="/offers" element={<OfferManager apiBase={API_BASE} />} />
                  <Route path="/availability" element={<AvailabilityManager apiBase={API_BASE} />} />
                  <Route path="/users" element={<UserManager apiBase={API_BASE} />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

const WelcomeSection = ({ user, stats }) => (
  <div className="relative overflow-hidden glass-card p-[32px] group">
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <Layout size={160} className="text-primary" />
    </div>
    <div className="relative z-10">
      <motion.h1 
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-[28px] font-semibold text-text-primary tracking-tight leading-tight"
      >
        Welcome back, {user?.username || 'Admin'} <span className="text-primary inline-block">👋</span>
      </motion.h1>
      <p className="text-text-secondary mt-3 text-[14px] font-medium max-w-xl leading-relaxed">
        System integrity is <span className="text-primary font-semibold uppercase tracking-wider">Optimal</span>. You have <span className="text-text-primary font-semibold">{(stats?.enquiries || 0) + (stats?.contacts || 0)} inquiries & messages</span>. Estimated total booking valuation is <span className="text-primary font-semibold">₹{(stats?.totalEstimatedValue || 0).toLocaleString()}</span> (₹{(stats?.approvedRevenue || 0).toLocaleString()} realized). Here's your luxury estate overview.
      </p>
      
      <div className="flex gap-[16px] mt-8">
          <div className="flex items-center gap-[12px] px-[16px] py-[10px] bg-bg-subtle rounded-xl border border-border-subtle">
            <Clock size={14} className="text-primary" />
            <span className="text-[12px] font-semibold text-text-secondary uppercase tracking-widest">Last login: 2h ago</span>
          </div>
          <div className="flex items-center gap-[12px] px-[16px] py-[10px] bg-bg-primary-subtle rounded-xl border border-border-primary-subtle">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]" />
            <span className="text-[12px] font-semibold text-primary uppercase tracking-widest">System Live</span>
          </div>
      </div>
    </div>
  </div>
);

const StatsGrid = ({ stats }) => (
  <div className="space-y-[24px]">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
      <StatCard title="Total Enquiries" value={stats?.enquiries || 0} icon={Briefcase} trend="12.5" isUp={true} />
      <StatCard title="Total Bookings" value={stats?.bookings || 0} icon={CalendarCheck} trend="8.2" isUp={true} />
      <StatCard title="Approved Revenue" value={`₹${(stats?.approvedRevenue || stats?.revenue || 0).toLocaleString()}`} icon={DollarSign} trend="3.1" isUp={true} />
      <StatCard title="Estimated Total Value" value={`₹${(stats?.totalEstimatedValue || 0).toLocaleString()}`} icon={DollarSign} trend="8.9" isUp={true} />
    </div>

    {/* Financial Valuation Analytics Breakdown */}
    <div className="glass-card card-padding">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-[12px] font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
          <TrendingUp size={14} className="text-primary animate-pulse" />
          Financial Valuation Analytics
        </h4>
        <span className="text-[11px] text-text-secondary font-semibold uppercase tracking-widest">
          {stats?.bookings || 0} Bookings Total
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Approved Booking Revenue (Actual)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-primary">₹{(stats?.approvedRevenue || stats?.revenue || 0).toLocaleString()}</span>
            <span className="text-[11px] font-bold text-primary/70">({stats?.approvedCount || 0} Approved)</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Pending Booking Revenue (Potential)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-amber-500">₹{(stats?.pendingRevenue || 0).toLocaleString()}</span>
            <span className="text-[11px] font-bold text-amber-500/70">({stats?.pendingCount || 0} Pending)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-text-secondary uppercase tracking-wider">Valuation Realization Yield</span>
            <span className="text-primary">
              {stats?.totalEstimatedValue ? Math.round(((stats?.approvedRevenue || stats?.revenue || 0) / stats?.totalEstimatedValue) * 100) : 0}%
            </span>
          </div>
          <div className="h-2 w-full bg-bg-subtle rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${stats?.totalEstimatedValue ? ((stats?.approvedRevenue || stats?.revenue || 0) / stats?.totalEstimatedValue) * 100 : 0}%` }}
              className="h-full bg-primary"
            />
            <div 
              style={{ width: `${stats?.totalEstimatedValue ? ((stats?.pendingRevenue || 0) / stats?.totalEstimatedValue) * 100 : 0}%` }}
              className="h-full bg-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EntityInventory = ({ stats }) => {
  const items = [
    { label: 'Rooms Inventory', count: stats?.rooms || 0, icon: BedDouble, color: 'text-primary' },
    { label: 'System Users', count: stats?.users || 0, icon: User, color: 'text-emerald-400' },
    { label: 'Marketing Banners', count: stats?.banners || 0, icon: Layout, color: 'text-cyan-400' },
    { label: 'Active Promotions', count: stats?.offers || 0, icon: Ticket, color: 'text-yellow-400' },
    { label: 'Resort Facilities', count: stats?.facilities || 0, icon: Briefcase, color: 'text-indigo-400' },
    { label: 'System Blogs', count: stats?.blogs || 0, icon: Clock, color: 'text-purple-400' },
    { label: 'Guest Testimonials', count: stats?.testimonials || 0, icon: CalendarDays, color: 'text-rose-400' },
    { label: 'Gallery Showcase', count: stats?.gallery || 0, icon: Layout, color: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-[16px]">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-bold text-text-primary tracking-tight">System Inventory & Counts</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[16px]">
        {items.map((item, idx) => (
          <div key={idx} className="glass-card p-4 hover:border-primary/30 transition-all flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-bg-subtle border border-border-subtle ${item.color}`}>
              <item.icon size={16} />
            </div>
            <div>
              <p className="text-[14px] font-black text-text-primary">{item.count}</p>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BannerSection = ({ banners }) => {
  const activeBanner = banners.find(b => b.isActive) || banners[0];
  
  if (!activeBanner && banners.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-[24px] bg-bg-subtle border border-border-subtle p-[32px] text-center"
      >
        <p className="text-text-secondary text-xs uppercase tracking-widest font-bold">No Active Banners Configured</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#132F2F] to-[#0A1919] border border-border-primary-subtle p-[32px] group"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Active Campaign</span>
            </div>
            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-widest">Live Now</span>
          </div>
          <h2 className="text-[32px] font-bold text-text-primary leading-tight tracking-tight">
            {activeBanner?.title || "Unleash the Summer Luxury Escape 🌴"}
          </h2>
          <p className="text-text-secondary mt-4 text-[15px] leading-relaxed">
            {activeBanner?.subtitle || "The seasonal promotion is currently driving 24% higher engagement on the website."}
          </p>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => activeBanner?.link && window.open(activeBanner.link, '_blank')}
              className="px-6 py-3 active-teal-gradient rounded-xl text-white text-[14px] font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              View Campaign Details
            </button>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary text-[14px] font-bold hover:bg-white/10 transition-colors">
              Update Inventory
            </button>
          </div>
        </div>
        
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-32 h-32 rounded-[32px] active-teal-gradient rotate-12 flex items-center justify-center shadow-2xl group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
            {activeBanner?.image ? (
              <img src={`${API_BASE.replace('/api', '')}/${activeBanner.image}`} alt="" className="w-full h-full object-cover" />
            ) : (
              <DollarSign size={48} className="text-white drop-shadow-lg" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const OfferSection = ({ offers }) => {
  const displayOffers = offers.length > 0 ? offers.slice(0, 3) : [
    { id: 1, title: 'No Active Offers', discount: '0%', status: 'Paused', bookings: 0, color: 'text-text-secondary' }
  ];

  return (
    <div className="space-y-[20px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-text-primary tracking-tight">Active Promotions & Offers</h3>
        <button 
          onClick={() => navigate('/offers')}
          className="text-[12px] font-bold text-primary uppercase tracking-widest hover:underline cursor-pointer"
        >
          Manage All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
        {displayOffers.map((offer, idx) => (
          <div key={offer._id || idx} className="glass-card p-6 group hover:border-primary/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl bg-bg-subtle border border-border-subtle group-hover:scale-110 transition-transform`}>
                <Ticket size={20} className={offer.color || 'text-primary'} />
              </div>
              <div className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${offer.status === 'Live' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-text-secondary border border-white/10'}`}>
                {offer.status || 'Paused'}
              </div>
            </div>
            <h4 className="text-[16px] font-bold text-text-primary mb-1">{offer.title}</h4>
            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-[24px] font-bold ${offer.color || 'text-primary'}`}>{offer.discount}</span>
            </div>
            <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
              <span className="text-[11px] text-text-secondary font-medium uppercase tracking-widest">Promo Code</span>
              <span className="text-[13px] font-bold text-text-primary tracking-widest">{offer.code || 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};





export default App;
