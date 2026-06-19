import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Badge, Button, CustomSelect, Modal } from '../common/UIComponents';
import { 
  Search, 
  Download, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  User, 
  Calendar, 
  DollarSign, 
  Tag,
  Eye,
  Edit3,
  Trash2,
  ListFilter,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecentBookings = ({ apiBase, role = "User" }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [viewModal, setViewModal] = useState({ open: false, booking: null });
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    fetchBookings();
  }, [apiBase, token]);

  const fetchBookings = async () => {
    if (!apiBase || !token) return;
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Booking Fetch Error:', err);
      toast.error('Failed to synchronize occupancy log');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${apiBase}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Booking status updated to ${status}`);
        fetchBookings();
        setViewModal({ open: false, booking: null });
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Network protocol error');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiBase}/bookings/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b._id !== deleteModal.id));
        setDeleteModal({ open: false, id: null });
        toast.success('Occupancy record purged successfully');
      } else {
        toast.error('Deletion protocol failed');
      }
    } catch (err) {
      toast.error('Network synchronization failure');
    }
  };

  const filteredBookings = useMemo(() => {
    const filtered = bookings.filter(b => {
      const gName = (b.guestName || 'Unknown Guest').toLowerCase();
      const roomId = (b.room?.name || b.room?.title || 'Unknown Suite').toLowerCase();
      const matchesSearch = gName.includes(searchTerm.toLowerCase()) || 
                           (b.bookingReference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           b._id.includes(searchTerm);
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort descending (newest first) by creation date (using createdAt, fallback to _id or checkIn)
    return [...filtered].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : null;
      const dateB = b.createdAt ? new Date(b.createdAt) : null;
      if (dateA && dateB) {
        return dateB - dateA;
      }
      if (a._id && b._id && a._id.length === 24 && b._id.length === 24) {
        return b._id.localeCompare(a._id);
      }
      return new Date(b.checkIn) - new Date(a.checkIn);
    });
  }, [bookings, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedData = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: bookings.length,
    filtered: filteredBookings.length,
    approved: bookings.filter(b => b.status === 'Approved').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
  };

  if (loading && role === "Admin") return <div className="py-20 text-center text-[12px] font-black text-text-secondary uppercase tracking-[0.3em] animate-pulse">Synchronizing Data Matrix...</div>;

  return (
    <div className="glass-card rounded-luxury overflow-hidden">
      {/* Header Section */}
      <div className="card-padding border-b border-border-subtle space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h3 className="text-[20px] font-bold text-text-primary tracking-tight flex items-center gap-3">
              Occupancy Intelligence
              <span className="px-2 py-0.5 bg-bg-primary-subtle text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                {stats.filtered} / {stats.total}
              </span>
            </h3>
            <p className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.2em]">Live guest deployment log</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2.5 px-5 py-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-[11px] font-bold text-text-secondary hover:bg-bg-subtle hover:text-white transition-all uppercase tracking-widest">
              <Download size={14} /> Export Protocol
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Filter by Reference ID or Guest Intelligence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bg-subtle border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-[13px] outline-none focus:bg-bg-subtle focus:border-border-primary-subtle text-text-primary font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
            {['All', 'Approved', 'Pending', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${
                  statusFilter === status 
                    ? 'active-teal-gradient text-white border-transparent' 
                    : 'bg-bg-subtle text-text-secondary border-border-subtle hover:border-border-primary-subtle hover:bg-bg-subtle'
                }`}
              >
                {status} 
                <span className={`ml-2 opacity-50 ${statusFilter === status ? 'text-white' : ''}`}>
                  ({status === 'All' ? stats.total : bookings.filter(b => b.status === status).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="pl-8">Guest & Suite Matrix</th>
              <th>Reference ID</th>
              <th>Schedule</th>
              <th>Status</th>
              <th className="text-right">Valuation</th>
              <th className="text-center pr-8">Operational Controls</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginatedData.map((booking) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={booking._id} 
                  className="group"
                >
                  <td className="pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center font-bold text-primary text-[14px] shrink-0 group-hover:scale-110 transition-transform">
                        {(booking.guestName || 'G').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary truncate tracking-tight text-[15px]">{booking.guestName || 'Unknown Guest'}</p>
                        <p className="text-[11px] text-text-secondary font-semibold uppercase tracking-wider mt-0.5">{booking.room?.name || booking.room?.title || 'Removed Suite'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-[11px] text-primary tracking-widest font-bold">
                    {booking.bookingReference || booking._id.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="text-[12px] font-medium text-text-secondary">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2"><Calendar size={12} className="text-primary/40" /> {new Date(booking.checkIn).toLocaleDateString()}</span>
                      <span className="text-[10px] opacity-40 ml-5 uppercase">to {new Date(booking.checkOut).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <Badge status={booking.status === 'Approved' ? 'success' : booking.status === 'Pending' ? 'warning' : 'danger'}>
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                      <p className="font-black text-text-primary tracking-tight text-[15px]">₹{booking.totalPrice?.toLocaleString() || '0.00'}</p>
                      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-0.5">Asset Value</p>
                  </td>
                  <td className="pr-8">
                    <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setViewModal({ open: true, booking })}
                        className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-primary hover:bg-primary/5 hover:border-border-primary-subtle transition-all" title="View Intelligence"
                      >
                        <Eye size={16} />
                      </button>
                      <div className="w-px h-4 bg-bg-subtle mx-1" />
                      <button 
                        onClick={() => setDeleteModal({ open: true, id: booking._id })}
                        className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/20 transition-all" title="Terminate Entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination Section */}
      <div className="card-padding bg-bg-subtle border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-widest">
            Synchronized <span className="text-text-primary font-black ml-1">{paginatedData.length}</span> of <span className="text-text-primary font-black">{stats.filtered}</span> entries
          </p>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">Limiter:</span>
            <CustomSelect 
              value={itemsPerPage}
              onChange={(val) => {
                setItemsPerPage(Number(val));
                setCurrentPage(1);
              }}
              options={[5, 10, 50, 100].map(s => ({ value: s, label: s }))}
              className="w-[80px]"
              variant="small"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="w-10 h-10 flex items-center justify-center bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-white hover:bg-bg-subtle disabled:opacity-20 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1 px-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                    currentPage === i + 1 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-text-secondary hover:text-white hover:bg-bg-subtle'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="w-10 h-10 flex items-center justify-center bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-white hover:bg-bg-subtle disabled:opacity-20 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Terminate Occupancy Record"
        footer={
            <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>Confirm Termination</Button>
            </div>
        }
      >
        <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <Trash2 size={32} />
            </div>
            <div>
                <h4 className="text-white font-bold text-lg">Are you absolutely sure?</h4>
                <p className="text-text-secondary text-sm mt-2">This action will permanently delete this booking record from the central intelligence domain. This cannot be reversed.</p>
            </div>
        </div>
      </Modal>

      {/* View/Edit Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, booking: null })}
        title="Booking Intelligence Report"
        footer={
            <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setViewModal({ open: false, booking: null })}>Close Report</Button>
                {viewModal.booking?.status === 'Pending' && (
                    <>
                        <Button variant="danger" onClick={() => handleUpdateStatus(viewModal.booking._id, 'Rejected')}>Reject</Button>
                        <Button onClick={() => handleUpdateStatus(viewModal.booking._id, 'Approved')}>Authorize</Button>
                    </>
                )}
                {viewModal.booking && (
                    <Button 
                        variant={viewModal.booking.paymentStatus === 'Paid' ? 'secondary' : 'primary'}
                        onClick={async () => {
                            const newStatus = viewModal.booking.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid';
                            try {
                                const res = await fetch(`${apiBase}/bookings/${viewModal.booking._id}`, {
                                    method: 'PATCH',
                                    headers: { 
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ paymentStatus: newStatus })
                                });
                                if (res.ok) {
                                    toast.success(`Payment marked as ${newStatus}`);
                                    fetchBookings();
                                    setViewModal({ open: false, booking: null });
                                }
                            } catch (err) { toast.error('Update failed'); }
                        }}
                    >
                        Mark as {viewModal.booking.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid'}
                    </Button>
                )}
            </div>
        }
      >
        {viewModal.booking && (
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-5 bg-bg-subtle border border-border-subtle rounded-[24px]">
                    <div className="w-16 h-16 rounded-2xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center text-3xl font-black text-primary">
                        {(viewModal.booking.guestName || 'G').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white tracking-tight">{viewModal.booking.guestName || 'Unknown Guest'}</h4>
                        <p className="text-[11px] text-text-secondary uppercase tracking-[0.2em] font-bold">{viewModal.booking.email}</p>
                    </div>
                    <div className="ml-auto">
                        <Badge status={viewModal.booking.status === 'Approved' ? 'success' : viewModal.booking.status === 'Pending' ? 'warning' : 'danger'}>
                            {viewModal.booking.status}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl space-y-1">
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Reserved Suite</p>
                        <p className="text-white font-bold">{viewModal.booking.room?.name || viewModal.booking.room?.title || 'N/A'}</p>
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
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Payment Protocol</p>
                        <Badge status={viewModal.booking.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                            {viewModal.booking.paymentStatus || 'Unpaid'}
                        </Badge>
                    </div>
                    <div className="col-span-2 p-4 bg-bg-subtle border border-border-subtle rounded-2xl space-y-1">
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Internal Reference</p>
                        <p className="text-primary font-mono font-bold tracking-tighter text-lg">{viewModal.booking.bookingReference || 'N/A'}</p>
                    </div>
                </div>

                {viewModal.booking.specialRequests && (
                    <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl space-y-2">
                         <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">Special Intelligence Instructions</p>
                         <p className="text-sm text-text-primary italic">"{viewModal.booking.specialRequests}"</p>
                    </div>
                )}

                <div className="p-4 bg-primary/5 border border-border-primary-subtle rounded-2xl flex items-start gap-3">
                    <AlertCircle size={18} className="text-primary mt-0.5" />
                    <div>
                        <p className="text-[11px] text-primary font-black uppercase tracking-widest">Protocol Intelligence</p>
                        <p className="text-[12px] text-primary/70 mt-1">This record was synchronized from the guest portal. Any changes to the status will trigger a notification event to the user's domain.</p>
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default RecentBookings;





