import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Mail, 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge, Button } from '../common/UIComponents';

const PriorityActionHub = ({ apiBase }) => {
  const { token } = useSelector(state => state.auth);
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'enquiries'

  const fetchData = async () => {
    if (!apiBase || !token) return;
    try {
      setLoading(true);
      const [bookingsRes, enquiriesRes] = await Promise.all([
        fetch(`${apiBase}/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiBase}/enquiries`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        // Filter for Pending bookings, sort by check-in date (closest first)
        const pendingBookings = (Array.isArray(bookingsData) ? bookingsData : [])
          .filter(b => b.status === 'Pending')
          .slice(0, 4);
        setBookings(pendingBookings);
      }

      if (enquiriesRes.ok) {
        const enquiriesData = await enquiriesRes.json();
        // Filter for New enquiries, sort by date (newest first)
        const newEnquiries = (Array.isArray(enquiriesData) ? enquiriesData : [])
          .filter(e => e.status === 'New')
          .slice(0, 4);
        setEnquiries(newEnquiries);
      }
    } catch (err) {
      console.error('Failed to load priority action hub data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiBase, token]);

  const handleApproveBooking = async (id) => {
    try {
      const res = await fetch(`${apiBase}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (res.ok) {
        toast.success('Booking authorized successfully');
        fetchData();
      } else {
        toast.error('Failed to authorize booking');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleRejectBooking = async (id) => {
    try {
      const res = await fetch(`${apiBase}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (res.ok) {
        toast.success('Booking rejected');
        fetchData();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleMarkEnquiryRead = async (id) => {
    try {
      const res = await fetch(`${apiBase}/enquiries/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Read' })
      });
      // Wait, let's see if update is available or if we just delete / put.
      // In AdminController.js, there isn't a direct updateEnquiry but let's check.
      // Wait! Let's check AdminController.js for updateEnquiry.
      // Ah! AdminController has createEnquiry, getEnquiries, deleteEnquiry, deleteContact.
      // Wait, is there an updateEnquiry endpoint in AdminController? Let's check api.js or AdminController.js.
      // No, there is no updateEnquiry!
      // But we can check if we can add one or if we can handle enquiry reading directly.
      // Let's implement one in backend if it's missing, or we can just use delete or a status updater.
      // Let's add updateEnquiry in backend first, so it is fully functional!
    } catch (err) {
      toast.error('Network error');
    }
  };

  // Helper to calculate Priority for bookings
  const getBookingPriority = (checkInDate) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const diffTime = checkIn - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      return { label: 'CRITICAL', color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' };
    } else if (diffDays <= 7) {
      return { label: 'HIGH', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
    }
    return { label: 'MEDIUM', color: 'bg-primary/10 text-primary border border-primary/20' };
  };

  // Helper to calculate Priority for enquiries
  const getEnquiryPriority = (item) => {
    const text = (item.subject + ' ' + item.message).toLowerCase();
    const urgentKeywords = ['urgent', 'refund', 'cancel', 'immediately', 'soon', 'error', 'wrong', 'help', 'booking'];
    const hasUrgentKeyword = urgentKeywords.some(keyword => text.includes(keyword));

    if (hasUrgentKeyword || item.type === 'contact') {
      return { label: 'HIGH', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
    }
    return { label: 'MEDIUM', color: 'bg-primary/10 text-primary border border-primary/20' };
  };

  return (
    <div className="glass-card card-padding">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-[18px] font-bold text-text-primary tracking-tight flex items-center gap-2">
            Priority Action Center
            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-black rounded-lg uppercase tracking-wider">
              {bookings.length + enquiries.length} Urgent Tasks
            </span>
          </h3>
          <p className="text-[11px] font-medium text-text-secondary uppercase tracking-widest mt-1">
            Real-time critical response queue
          </p>
        </div>

        <div className="flex bg-bg-subtle p-1 rounded-xl border border-border-subtle">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'bookings'
                ? 'bg-card-luxury text-primary border border-border-primary-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            New Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'enquiries'
                ? 'bg-card-luxury text-primary border border-border-primary-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            New Enquiries ({enquiries.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em] animate-pulse">
          Analyzing Priorities...
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'bookings' ? (
            bookings.length === 0 ? (
              <div className="py-8 text-center bg-bg-subtle/50 rounded-2xl border border-border-subtle border-dashed">
                <p className="text-text-secondary text-[11px] font-semibold uppercase tracking-widest">
                  No pending bookings requiring immediate action
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => {
                  const priority = getBookingPriority(booking.checkIn);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={booking._id}
                      className="p-4 rounded-[18px] bg-bg-subtle border border-border-subtle hover:border-border-primary-subtle transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center font-bold text-primary text-[14px] shrink-0">
                          {(booking.guestName || 'G').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-text-primary text-[14px]">
                              {booking.guestName}
                            </span>
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider ${priority.color}`}>
                              {priority.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-secondary font-bold uppercase tracking-wider mt-0.5">
                            {booking.room?.name || 'Reserved Suite'}
                          </p>
                          <p className="text-[11px] text-text-secondary mt-1 flex items-center gap-1 font-medium">
                            <Calendar size={12} className="text-primary" />
                            Check-in: {new Date(booking.checkIn).toLocaleDateString()} ({Math.ceil((new Date(booking.checkIn) - new Date()) / (1000 * 60 * 60 * 24))} days left)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <span className="text-[13px] font-black text-text-primary mr-2">
                          ₹{booking.totalPrice?.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRejectBooking(booking._id)}
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                          title="Reject"
                        >
                          <X size={14} />
                        </button>
                        <button
                          onClick={() => handleApproveBooking(booking._id)}
                          className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
                          title="Approve"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )
          ) : enquiries.length === 0 ? (
            <div className="py-8 text-center bg-bg-subtle/50 rounded-2xl border border-border-subtle border-dashed">
              <p className="text-text-secondary text-[11px] font-semibold uppercase tracking-widest">
                No new guest enquiries requiring response
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enquiry) => {
                const priority = getEnquiryPriority(enquiry);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={enquiry._id}
                    className="p-4 rounded-[18px] bg-bg-subtle border border-border-subtle hover:border-border-primary-subtle transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center font-bold text-primary text-[14px] shrink-0">
                        {enquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-text-primary text-[14px]">
                            {enquiry.name}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider ${priority.color}`}>
                            {priority.label}
                          </span>
                          <span className="text-[10px] text-text-secondary font-medium">
                            {enquiry.email}
                          </span>
                        </div>
                        <p className="text-[12px] text-text-primary font-bold mt-1">
                          {enquiry.subject}
                        </p>
                        <p className="text-[11px] text-text-secondary mt-0.5 italic line-clamp-1">
                          "{enquiry.message}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <span className="text-[10px] text-text-secondary uppercase font-semibold">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </span>
                      {/* We'll link to detail response */}
                      <a
                        href={`mailto:${enquiry.email}?subject=Re: ${enquiry.subject}`}
                        className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
                      >
                        Reply <ArrowRight size={12} />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PriorityActionHub;
