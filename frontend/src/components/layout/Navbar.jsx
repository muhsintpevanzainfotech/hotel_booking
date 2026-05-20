import React, { useState, useEffect } from 'react';
import { Search, Bell, Calendar, Menu, X, Clock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { fetchNotificationsRequest, markNotificationsReadRequest } from '../../redux/slices/notificationSlice';

const Navbar = ({ toggleSidebar, isOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { list: notifications } = useSelector(state => state.notifications);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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

  const handleMarkRead = () => {
    if (unreadCount > 0) {
      dispatch(markNotificationsReadRequest());
    }
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
        <div className="relative group">
          <button 
            onClick={handleMarkRead}
            className="relative w-10 h-10 rounded-xl bg-bg-subtle border border-border-subtle text-text-secondary hover:bg-card-luxury hover:text-text-primary transition-all flex items-center justify-center"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-bg-luxury animate-pulse" />
            )}
          </button>
          
          {/* Notification Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-[320px] bg-card-luxury border border-border-subtle rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-subtle">
              <h4 className="text-[12px] font-bold text-text-primary uppercase tracking-widest">Intelligence Feed</h4>
              {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-bg-primary-subtle text-primary text-[10px] font-bold rounded-lg uppercase tracking-wider">{unreadCount} New</span>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n._id} className={twMerge(
                      "p-4 border-b border-border-subtle hover:bg-bg-subtle transition-colors cursor-pointer group/item relative",
                      !n.isRead && "bg-bg-primary-subtle/5"
                  )}>
                    {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[13px] font-semibold text-text-primary group-hover/item:text-primary transition-colors">{n.title}</p>
                      <span className="text-[10px] text-text-secondary font-medium uppercase tracking-tighter whitespace-nowrap">{getRelativeTime(n.createdAt)}</span>
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
                    onClick={handleMarkRead}
                    className="text-[11px] font-bold text-primary hover:text-accent transition-colors uppercase tracking-widest"
                  >
                    Clear All Alerts
                  </button>
                </div>
            )}
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-border-subtle h-8">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-semibold text-text-primary leading-none tracking-tight">{user?.username || 'Admin'}</p>
            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-[0.1em] mt-1">Master Admin</p>
          </div>
          <div className="w-9 h-9 rounded-xl active-teal-gradient border border-border-subtle flex items-center justify-center font-bold text-text-primary text-sm shadow-[0_4px_12px_rgba(20,184,166,0.2)] cursor-pointer hover:scale-105 transition-transform">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
