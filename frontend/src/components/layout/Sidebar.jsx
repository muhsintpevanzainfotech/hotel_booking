import React from 'react';
import {
  LayoutGrid,
  MessageSquare,
  PhoneCall,
  Globe,
  MessageCircle,
  Image,
  FileText,
  BedDouble,
  Hotel,
  Calendar,
  CheckCircle,
  Users,
  Settings,
  ChevronLeft,
  LogOut,
  Mail,
  Zap,
  Ticket,
  Layers,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { twMerge } from 'tailwind-merge';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/')[1] || 'dashboard';
  const { user } = useSelector(state => state.auth);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, roles: ['super_admin', 'admin', 'manager'] },
    { id: 'bookings', label: 'Bookings', icon: Calendar, roles: ['super_admin', 'admin'] },
    { id: 'availability', label: 'Availability', icon: CheckCircle, roles: ['super_admin', 'admin'] },
    { id: 'enquiries', label: 'Guest Enquiries', icon: MessageSquare, roles: ['super_admin', 'admin'] },
    { id: 'contact_messages', label: 'Contact Messages', icon: Mail, roles: ['super_admin', 'admin'] },
    { id: 'social', label: 'Social Ecosystem', icon: Globe, roles: ['super_admin'] },
    { id: 'testimonials', label: 'Testimonials', icon: MessageCircle, roles: ['super_admin', 'admin'] },
    { id: 'gallery', label: 'Gallery', icon: Image, roles: ['super_admin', 'admin'] },
    { id: 'blogs', label: 'Blogs', icon: FileText, roles: ['super_admin', 'admin'] },
    { id: 'banners', label: 'Banners', icon: Zap, roles: ['super_admin', 'admin'] },
    { id: 'offers', label: 'Special Offers', icon: Ticket, roles: ['super_admin', 'admin'] },
    { id: 'combo_offers', label: 'Combo Offers', icon: Gift, roles: ['super_admin', 'admin'] },
    { id: 'facilities', label: 'Facilities', icon: BedDouble, roles: ['super_admin', 'admin'] },
    { id: 'categories', label: 'Categories', icon: Layers, roles: ['super_admin', 'admin'] },
    { id: 'rooms', label: 'Rooms', icon: Hotel, roles: ['super_admin', 'admin'] },
    { id: 'users', label: 'Users', icon: Users, roles: ['super_admin', 'admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['super_admin', 'admin', 'manager'] },
  ];

  const filteredItems = menuItems.filter(item => {
    if (user?.role === 'super_admin') return true;
    if (user?.permissions && user.permissions.length > 0) {
      return user.permissions.includes(item.id);
    }
    return item.roles.includes(user?.role);
  });

  return (
    <aside
      className={twMerge(
        "fixed left-0 top-0 h-screen bg-bg-deep border-r border-border-subtle z-50 transition-all duration-300 flex flex-col",
        isOpen ? "w-[240px]" : "w-[72px] -translate-x-full lg:translate-x-0"
      )}
    >
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-[-1]"
          />
        )}
      </AnimatePresence>

      {/* Logo Section */}
      <div className="h-16 flex items-center px-[16px] mb-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl active-teal-gradient flex items-center justify-center shadow-[0_0_15px_var(--primary)] shrink-0 overflow-hidden">
          <img src="/favicon.png" alt="Logo" className="w-7 h-7 object-contain" />
        </div>
        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            width: isOpen ? 'auto' : 0,
            marginLeft: isOpen ? 12 : 0
          }}
          className="flex flex-col overflow-hidden whitespace-nowrap"
        >
          <span className="font-bold text-[18px] text-text-primary tracking-[0.05em] leading-none font-['Outfit']">
            LAKE BREEZE
          </span>
          <span className="text-[10px] text-text-secondary font-medium uppercase tracking-[0.4em] mt-1 font-['Outfit']">
            Resorts
          </span>
        </motion.div>
      </div>

      <div className="px-[14px] py-2 space-y-2 overflow-y-auto flex-1 custom-scrollbar overflow-x-hidden">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              navigate(`/${item.id}`);
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className={twMerge(
              "w-full flex items-center h-[44px] rounded-xl transition-all duration-300 group relative cursor-pointer",
              isOpen ? "px-3" : "px-0 justify-center",
              activeTab === item.id
                ? "active-teal-gradient text-white shadow-lg"
                : "text-text-secondary hover:bg-bg-subtle hover:text-white"
            )}
          >
            <item.icon
              size={20}
              strokeWidth={activeTab === item.id ? 2.5 : 2}
              className={twMerge(
                "shrink-0 transition-transform group-hover:scale-110",
                activeTab === item.id ? "text-white" : "text-text-secondary group-hover:text-primary"
              )}
            />
            <motion.span
              initial={false}
              animate={{
                opacity: isOpen ? 1 : 0,
                width: isOpen ? 'auto' : 0,
                marginLeft: isOpen ? 12 : 0
              }}
              className="text-[14px] font-medium tracking-wide whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>

            {!isOpen && (
              <div className="absolute left-[80px] px-3 py-1.5 bg-card-luxury border border-border-subtle rounded-lg text-text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl z-50 whitespace-nowrap">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Profile Section */}
      <div className="p-[16px] border-t border-border-subtle bg-bg-deep flex-shrink-0">
        <div className={twMerge(
          "flex items-center p-2 rounded-xl bg-bg-subtle border border-border-subtle group transition-all",
          isOpen ? "justify-between" : "justify-center"
        )}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center font-bold text-primary text-xs shrink-0">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <motion.div
              initial={false}
              animate={{
                opacity: isOpen ? 1 : 0,
                width: isOpen ? 'auto' : 0,
                marginLeft: isOpen ? 12 : 0
              }}
              className="overflow-hidden"
            >
              <p className="text-[12px] font-semibold text-text-primary leading-none truncate w-24">{user?.username || 'Admin'}</p>
              <p className="text-[10px] text-text-secondary font-medium uppercase tracking-widest mt-1">
                {user?.role === 'super_admin' ? 'Administrator' : user?.role?.replace('_', ' ') || 'Admin'}
              </p>
            </motion.div>
          </div>
          {isOpen && (
            <button
              onClick={() => dispatch(logout())}
              className="p-1.5 text-text-secondary hover:text-rose-400 transition-colors"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
