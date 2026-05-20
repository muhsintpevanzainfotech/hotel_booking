import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Users, 
  BedDouble, 
  Clock,
  Info,
  ChevronDown,
  Filter,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Modal, Button } from '../common/UIComponents';

const AvailabilityCalendar = ({ apiBase }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewModal, setViewModal] = useState({ open: false, booking: null });
  const [roomFilter, setRoomFilter] = useState('All');
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    fetchData();
  }, [apiBase, token]);

  const fetchData = async () => {
    if (!apiBase || !token) return;
    try {
      setLoading(true);
      const [bookingsRes, roomsRes] = await Promise.all([
        fetch(`${apiBase}/bookings`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiBase}/rooms`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!bookingsRes.ok || !roomsRes.ok) throw new Error('Failed to fetch data');

      const bookingsData = await bookingsRes.json();
      const roomsData = await roomsRes.json();

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('Failed to sync occupancy data');
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const calendarDays = useMemo(() => {
    const days = [];
    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, type: 'padding' });
    }
    // Actual days
    for (let i = 1; i <= numDays; i++) {
      const date = new Date(year, month, i);
      const dayBookings = bookings.filter(b => {
        const checkIn = new Date(b.checkIn);
        const checkOut = new Date(b.checkOut);
        const d = new Date(year, month, i);
        d.setHours(0, 0, 0, 0);
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);
        
        const matchesDate = d >= checkIn && d < checkOut;
        const matchesStatus = (b.status === 'Approved' || b.status === 'Pending');
        const matchesRoom = roomFilter === 'All' || b.room?._id === roomFilter || b.room === roomFilter;
        
        return matchesDate && matchesStatus && matchesRoom;
      });
      days.push({ day: i, date, bookings: dayBookings, type: 'day' });
    }
    return days;
  }, [year, month, bookings, numDays, firstDay, roomFilter]);

  const handleDayClick = (day) => {
    if (day.type === 'day') {
      setSelectedDay(day);
    }
  };

  if (loading) return (
    <div className="py-24 text-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
      <p className="text-[12px] font-black text-text-secondary uppercase tracking-[0.3em] animate-pulse">Initializing Temporal Matrix...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-luxury overflow-hidden">
        {/* Calendar Header */}
        <div className="card-padding border-b border-border-subtle flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-bg-primary-subtle border border-border-primary-subtle flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-primary uppercase leading-none mb-1">{monthNames[month].substring(0, 3)}</span>
              <span className="text-[20px] font-bold text-primary leading-none">{year}</span>
            </div>
            <div>
              <h3 className="text-[24px] font-bold text-white tracking-tight leading-tight">{monthNames[month]} {year}</h3>
              <p className="text-[12px] font-medium text-text-secondary uppercase tracking-widest mt-1">Occupancy Intelligence Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={prevMonth}
              className="w-10 h-10 flex items-center justify-center bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-white hover:border-primary transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-5 py-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-[11px] font-bold text-text-secondary hover:text-white transition-all uppercase tracking-widest"
            >
              Today
            </button>
            <button 
              onClick={nextMonth}
              className="w-10 h-10 flex items-center justify-center bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-white hover:border-primary transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-4 border-b border-border-subtle bg-bg-subtle/20 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
                <Filter size={14} className="text-primary" />
                <span className="text-[11px] font-black text-text-secondary uppercase tracking-widest">Filter by Suite:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                <button 
                    onClick={() => setRoomFilter('All')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${roomFilter === 'All' ? 'bg-primary text-white border-transparent shadow-lg shadow-primary/20' : 'bg-bg-subtle text-text-secondary border-border-subtle hover:border-primary/30'}`}
                >
                    All Suites
                </button>
                {rooms.map(room => (
                    <button 
                        key={room._id}
                        onClick={() => setRoomFilter(room._id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${roomFilter === room._id ? 'bg-primary text-white border-transparent shadow-lg shadow-primary/20' : 'bg-bg-subtle text-text-secondary border-border-subtle hover:border-primary/30'}`}
                    >
                        {room.name}
                    </button>
                ))}
            </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-1">
          <div className="grid grid-cols-7 border-b border-border-subtle bg-bg-subtle/30">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-4 text-center text-[11px] font-black text-text-secondary uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const isToday = day.date?.toDateString() === new Date().toDateString();
              const isSelected = selectedDay?.day === day.day && day.type === 'day';
              const hasBookings = day.bookings?.length > 0;

              return (
                <div 
                  key={idx} 
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[140px] p-3 border-r border-b border-border-subtle transition-all cursor-pointer relative group
                    ${day.type === 'padding' ? 'bg-bg-subtle/10' : 'hover:bg-bg-subtle/50'}
                    ${isSelected ? 'bg-primary/5 !border-primary/30 z-10' : ''}
                  `}
                >
                  {day.type === 'day' && (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[15px] font-bold ${isToday ? 'w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center -mt-1 -ml-1 shadow-lg shadow-primary/30' : 'text-text-secondary'}`}>
                          {day.day}
                        </span>
                        {hasBookings && (
                          <div className="flex -space-x-2 overflow-hidden">
                            {day.bookings.slice(0, 3).map((b, i) => (
                              <div key={b._id} className="w-5 h-5 rounded-full bg-primary border-2 border-bg-luxury flex items-center justify-center text-[8px] font-black text-white">
                                {b.guestName?.charAt(0)}
                              </div>
                            ))}
                            {day.bookings.length > 3 && (
                              <div className="w-5 h-5 rounded-full bg-bg-subtle border-2 border-bg-luxury flex items-center justify-center text-[8px] font-black text-text-secondary">
                                +{day.bookings.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 overflow-hidden">
                        {day.bookings.slice(0, 4).map(booking => (
                          <div 
                            key={booking._id}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold truncate border transition-all
                              ${booking.status === 'Approved' 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}
                            `}
                          >
                            {booking.room?.name || 'Room'} - {booking.guestName}
                          </div>
                        ))}
                        {day.bookings.length > 4 && (
                          <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest pl-1">
                            + {day.bookings.length - 4} More Records
                          </p>
                        )}
                      </div>
                      
                      {!hasBookings && day.type === 'day' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Vacant</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Day Details Panel */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-luxury overflow-hidden"
          >
            <div className="card-padding border-b border-border-subtle flex justify-between items-center">
              <div>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  Deployments for {monthNames[month]} {selectedDay.day}, {year}
                </h4>
                <p className="text-[11px] text-text-secondary font-black uppercase tracking-[0.2em] mt-1">Detailed Operational Log</p>
              </div>
              <Badge status={selectedDay.bookings.length > 0 ? "success" : "secondary"}>
                {selectedDay.bookings.length} Bookings Active
              </Badge>
            </div>

            <div className="p-6">
              {selectedDay.bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedDay.bookings.map(booking => (
                    <div 
                      key={booking._id}
                      onClick={() => setViewModal({ open: true, booking })}
                      className="group p-5 bg-bg-subtle border border-border-subtle rounded-[24px] hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CalendarIcon size={64} className="text-primary" />
                      </div>
                      
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center text-primary font-bold">
                            {booking.guestName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-[15px]">{booking.guestName}</p>
                            <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-0.5">{booking.room?.name || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                                <Clock size={10} className="text-primary" /> Check In
                              </p>
                              <p className="text-xs font-bold text-white">{new Date(booking.checkIn).toLocaleDateString()}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                                <Clock size={10} className="text-rose-500" /> Check Out
                              </p>
                              <p className="text-xs font-bold text-white">{new Date(booking.checkOut).toLocaleDateString()}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <Badge status={booking.status === 'Approved' ? 'success' : 'warning'}>
                                {booking.status}
                            </Badge>
                            <span className="text-primary font-black text-sm">₹{booking.totalPrice?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-bg-subtle border border-dashed border-border-subtle flex items-center justify-center mx-auto mb-4">
                    <BedDouble size={24} className="text-text-secondary opacity-30" />
                  </div>
                  <h5 className="text-white font-bold text-lg">No Deployments Detected</h5>
                  <p className="text-text-secondary text-sm mt-1">There are no active bookings for this specific date.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, booking: null })}
        title="Deployment Intelligence Report"
        footer={<Button variant="secondary" onClick={() => setViewModal({ open: false, booking: null })}>Close Intelligence</Button>}
      >
        {viewModal.booking && (
          <div className="space-y-6">
              <div className="flex items-center gap-4 p-5 bg-bg-subtle border border-border-subtle rounded-[24px]">
                  <div className="w-16 h-16 rounded-2xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center text-3xl font-black text-primary">
                      {viewModal.booking.guestName?.charAt(0)}
                  </div>
                  <div>
                      <h4 className="text-xl font-bold text-white tracking-tight">{viewModal.booking.guestName}</h4>
                      <p className="text-[11px] text-text-secondary uppercase tracking-[0.2em] font-bold">{viewModal.booking.email}</p>
                  </div>
                  <div className="ml-auto">
                      <Badge status={viewModal.booking.status === 'Approved' ? 'success' : 'warning'}>
                          {viewModal.booking.status}
                      </Badge>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl space-y-1">
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Reserved Suite</p>
                      <p className="text-white font-bold">{viewModal.booking.room?.name || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl space-y-1">
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Total Valuation</p>
                      <p className="text-primary font-black text-lg">₹{viewModal.booking.totalPrice?.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl space-y-1">
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Check-In Node</p>
                      <p className="text-white font-bold">{new Date(viewModal.booking.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl space-y-1">
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Check-Out Node</p>
                      <p className="text-white font-bold">{new Date(viewModal.booking.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl space-y-1">
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Occupants</p>
                      <p className="text-white font-bold">{viewModal.booking.adults} Adults, {viewModal.booking.children} Children</p>
                  </div>
                  <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl space-y-1">
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Internal Reference</p>
                      <p className="text-primary font-mono font-bold tracking-tighter">{viewModal.booking.bookingReference || viewModal.booking._id}</p>
                  </div>
              </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AvailabilityCalendar;
