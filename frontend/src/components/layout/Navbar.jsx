import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calendar, Menu, X, Clock, Trash2, Settings, LogOut, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { 
  fetchNotificationsRequest, 
  markNotificationsReadRequest,
  deleteNotificationRequest,
  clearAllNotificationsRequest
} from '../../redux/slices/notificationSlice';
import { logout } from '../../redux/slices/authSlice';

const Navbar = ({ toggleSidebar, isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { list: notifications } = useSelector(state => state.notifications);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotificationsRequest());
      // Poll for new notifications every minute
      const poll = setInterval(() => dispatch(fetchNotificationsRequest()), 60000);
      return () => clearInterval(poll);
    }
  }, [user, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now - then) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      dispatch(markNotificationsReadRequest());
    }
  };

  const handleClearAll = () => {
    dispatch(clearAllNotificationsRequest());
  };

  const handleNotificationClick = (n) => {
    if (!n.isRead) {
      dispatch(markNotificationsReadRequest(n._id));
    }
    
    // Navigate based on type
    if (n.type === 'booking') {
      navigate('/bookings');
    } else if (n.type === 'enquiry') {
      navigate('/enquiries');
    } else if (n.type === 'contact') {
      navigate('/contact_messages');
    }
    
    setShowNotifications(false);
  };

  const handleDeleteNotification = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotificationRequest(id));
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileMenu(false);
  };

  const handleProfileOption = (path) => {
    navigate(path);
    setShowProfileMenu(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <nav className="sticky top-0 h-[64px] bg-bg-luxury/80 backdrop-blur-md border-b border-border-subtle z-40 flex items-center justify-between px-[24px] w-full shrink-0">
      <div className="flex items-center gap-[20px] flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-bg-subtle border border-border-subtle text-text-secondary hover:text-primary transition-all lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-bg-subtle border border-border-subtle text-text-secondary hover:text-primary transition-all hidden lg:flex"
        >
          <Menu size={20} />
        </button>

        <div className="relative group max-w-md w-full hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search analytics..."
            className="w-full bg-bg-subtle border border-border-subtle rounded-xl h-10 pl-10 pr-4 text-[13px] outline-none focus:bg-card-luxury focus:border-border-primary-subtle text-text-primary font-medium transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-5">
        {/* Date Range Selector */}
        <div className="hidden lg:flex items-center gap-3 bg-bg-subtle border border-border-subtle rounded-xl px-4 h-10 hover:bg-card-luxury transition-all cursor-default">
          <Calendar size={14} className="text-primary" />
          <span className="text-[12px] font-semibold text-text-secondary uppercase tracking-widest">
            {formatDate(currentDateTime)}
          </span>
          <div className="w-px h-3 bg-border-subtle mx-1" />
          <Clock size={14} className="text-primary" />
          <span className="text-[12px] font-semibold text-text-secondary uppercase tracking-widest">
            {formatTime(currentDateTime)}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="relative w-10 h-10 rounded-xl bg-bg-subtle border border-border-subtle text-text-secondary hover:bg-card-luxury hover:text-text-primary transition-all flex items-center justify-center"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-bg-luxury animate-pulse" />
            )}
          </button>
          
          {/* Notification Dropdown */}
          <div className={twMerge(
            "absolute right-0 top-full mt-2 w-[320px] bg-card-luxury border border-border-subtle rounded-2xl shadow-2xl transition-all duration-300 z-50 overflow-hidden",
            showNotifications ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
          )}>
            <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-subtle">
              <h4 className="text-[12px] font-bold text-text-primary uppercase tracking-widest">Intelligence Feed</h4>
              {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-bg-primary-subtle text-primary text-[10px] font-bold rounded-lg uppercase tracking-wider">{unreadCount} New</span>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n._id} 
                    onClick={() => handleNotificationClick(n)}
                    className={twMerge(
                      "p-4 border-b border-border-subtle hover:bg-bg-subtle transition-colors cursor-pointer group/item relative",
                      !n.isRead && "bg-bg-primary-subtle/5"
                    )}
                  >
                    {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <p className="text-[13px] font-semibold text-text-primary group-hover/item:text-primary transition-colors">{n.title}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-text-secondary font-medium uppercase tracking-tighter whitespace-nowrap">{getRelativeTime(n.createdAt)}</span>
                        <button 
                          onClick={(e) => handleDeleteNotification(e, n._id)}
                          className="p-1 rounded-md text-text-secondary hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity ml-1 shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">{n.message}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                    <Bell size={32} className="mx-auto text-border-subtle mb-3 opacity-20" />
                    <p className="text-[11px] text-text-secondary font-medium uppercase tracking-widest">No active alerts</p>
                </div>
              )}
            </div>
            {notifications.length > 0 && (
                <div className="p-3 text-center bg-bg-subtle border-t border-border-subtle">
                  <button 
                    onClick={handleClearAll}
                    className="text-[11px] font-bold text-primary hover:text-accent transition-colors uppercase tracking-widest"
                  >
                    Clear All Alerts
                  </button>
                </div>
            )}
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <div 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center gap-3 pl-4 border-l border-border-subtle h-8 cursor-pointer group"
          >
            <div className="text-right hidden sm:block select-none">
              <p className="text-[13px] font-semibold text-text-primary leading-none tracking-tight group-hover:text-primary transition-colors">{user?.username || 'Admin'}</p>
              <p className="text-[10px] text-text-secondary font-medium uppercase tracking-[0.1em] mt-1">Master Admin</p>
            </div>
            <div className="w-9 h-9 rounded-xl active-teal-gradient border border-border-subtle flex items-center justify-center font-bold text-text-primary text-sm shadow-[0_4px_12px_rgba(20,184,166,0.2)] hover:scale-105 transition-transform">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>

          {/* Profile Menu Dropdown */}
          <div className={twMerge(
            "absolute right-0 top-full mt-4 w-[200px] bg-card-luxury border border-border-subtle rounded-2xl shadow-2xl transition-all duration-300 z-50 overflow-hidden",
            showProfileMenu ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
          )}>
            <div className="p-4 border-b border-border-subtle bg-bg-subtle">
              <p className="text-[12px] font-bold text-text-primary uppercase tracking-wider truncate">{user?.username || 'Admin'}</p>
              <p className="text-[10px] text-text-secondary font-medium uppercase tracking-widest mt-1">
                {user?.role === 'super_admin' ? 'Administrator' : user?.role?.replace('_', ' ') || 'Admin'}
              </p>
            </div>
            <div className="p-2 space-y-1">
              <button 
                onClick={() => handleProfileOption('/settings')}
                className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-xl transition-all"
              >
                <Settings size={14} className="text-primary" />
                Settings
              </button>
              <div className="h-px bg-border-subtle my-1" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <LogOut size={14} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
