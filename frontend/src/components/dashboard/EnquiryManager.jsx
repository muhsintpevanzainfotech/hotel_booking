import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal, Button, CustomSelect } from '../common/UIComponents';
import toast from 'react-hot-toast';

const EnquiryManager = ({ apiBase, type, title = "Contact Messages" }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [viewModal, setViewModal] = useState({ open: false, data: null });
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchEnquiries = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const url = `${apiBase}/enquiries${type ? `?type=${type}` : ''}`;
        const res = await fetch(url, { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error(res.status === 401 ? 'Unauthorized Access' : 'Server Error');
        const data = await res.json();
        setEnquiries(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [apiBase, token, type]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enquiries, searchTerm]);

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedData = filteredEnquiries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${apiBase}/enquiries/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setEnquiries(prev => prev.filter(e => e._id !== deleteModal.id));
        setDeleteModal({ open: false, id: null });
        toast.success('Communication entry purged successfully');
      } else {
        toast.error('Protocol failure: Could not delete enquiry');
      }
    } catch (err) {
      console.error('Purge Error:', err);
      toast.error('System synchronization error');
    }
  };

  if (loading) return <div className="py-20 text-center text-[12px] font-semibold text-text-secondary uppercase tracking-[0.3em] animate-pulse">Scanning Enquiries...</div>;
  if (error) return (
    <div className="card-padding text-center bg-rose-500/5 rounded-luxury border border-rose-500/10">
        <p className="text-rose-500 text-[12px] font-semibold uppercase tracking-widest">Access Denied: {error}</p>
    </div>
  );

  return (
    <div className="glass-card rounded-luxury overflow-hidden">
        <div className="card-padding border-b border-border-subtle space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h3 className="text-[20px] font-bold text-text-primary tracking-tight flex items-center gap-3">
                        {title}
                        <span className="px-2 py-0.5 bg-bg-primary-subtle text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                            {filteredEnquiries.length} / {enquiries.length}
                        </span>
                    </h3>
                    <p className="text-[12px] font-medium text-text-secondary uppercase tracking-widest mt-1">Live Guest Communication</p>
                </div>
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search Guest Intelligence..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-bg-subtle border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-[13px] outline-none focus:bg-bg-subtle focus:border-border-primary-subtle text-text-primary font-medium transition-all"
                    />
                </div>
            </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th className="pl-8">Guest Intelligence</th>
                        <th>Subject Domain</th>
                        <th>Message Preview</th>
                        <th>Logged At</th>
                        <th className="text-center pr-8">Operational Controls</th>
                    </tr>
                </thead>
                <tbody>
                    <AnimatePresence mode="popLayout">
                        {paginatedData.length > 0 ? paginatedData.map(e => (
                            <motion.tr 
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={e._id} 
                                className="group cursor-pointer"
                            >
                                <td className="pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center font-bold text-primary text-[12px]">
                                            {e.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-primary tracking-tight text-[15px]">{e.name}</p>
                                            <p className="text-[11px] text-text-secondary truncate w-40">{e.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-[13px] font-medium text-text-primary">
                                    {e.subject}
                                </td>
                                <td className="max-w-xs">
                                    <p className="text-[13px] text-text-secondary truncate group-hover:text-text-primary transition-colors italic">"{e.message}"</p>
                                </td>
                                <td className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">
                                    {new Date(e.createdAt).toLocaleDateString()}
                                </td>
                                <td className="pr-8">
                                    <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => setViewModal({ open: true, data: e })}
                                            className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-primary hover:bg-primary/5 hover:border-border-primary-subtle transition-all"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button 
                                          onClick={() => setDeleteModal({ open: true, id: e._id })}
                                          className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/20 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="py-24 text-center">
                                    <p className="text-text-secondary text-[12px] font-medium uppercase tracking-widest">No intelligence found</p>
                                </td>
                            </tr>
                        )}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>

        <div className="card-padding bg-bg-subtle border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-widest">
                    Showing <span className="text-text-primary font-black ml-1">{paginatedData.length}</span> of <span className="text-text-primary font-black">{filteredEnquiries.length}</span> entries
                </p>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">Limiter:</span>
                    <CustomSelect 
                        value={itemsPerPage}
                        onChange={(val) => {setItemsPerPage(Number(val)); setCurrentPage(1);}}
                        options={[5, 10, 50, 100].map(s => ({ value: s, label: s }))}
                        className="w-[80px]"
                        variant="small"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-white disabled:opacity-20 transition-all"><ChevronLeft size={18} /></button>
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-white disabled:opacity-20 transition-all"><ChevronRight size={18} /></button>
            </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
            isOpen={deleteModal.open}
            onClose={() => setDeleteModal({ open: false, id: null })}
            title="Purge Communication Record"
            footer={
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Confirm Purge</Button>
                </div>
            }
        >
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                    <Trash2 size={32} />
                </div>
                <div>
                    <h4 className="text-white font-bold text-lg">Are you absolutely sure?</h4>
                    <p className="text-text-secondary text-sm mt-2">This action will permanently remove this guest enquiry from the central database. This cannot be undone.</p>
                </div>
            </div>
        </Modal>

        {/* View Modal */}
        <Modal
            isOpen={viewModal.open}
            onClose={() => setViewModal({ open: false, data: null })}
            title="Guest Intelligence Detail"
            footer={
                <Button variant="secondary" onClick={() => setViewModal({ open: false, data: null })}>Close</Button>
            }
        >
            {viewModal.data && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-5 bg-bg-subtle border border-border-subtle rounded-[24px]">
                        <div className="w-12 h-12 rounded-xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center text-xl font-bold text-primary">
                            {viewModal.data.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white">{viewModal.data.name}</h4>
                            <p className="text-xs text-text-secondary">{viewModal.data.email}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Subject Domain</label>
                        <div className="bg-bg-subtle border border-border-subtle rounded-xl p-4 text-sm text-text-primary">
                            {viewModal.data.subject}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Intelligence Payload (Message)</label>
                        <div className="bg-bg-subtle border border-border-subtle rounded-[24px] p-5 text-sm text-text-primary leading-relaxed italic">
                            "{viewModal.data.message}"
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-bg-subtle border border-border-subtle rounded-xl">
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Logged At</span>
                        <span className="text-[12px] text-text-primary font-medium">{new Date(viewModal.data.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            )}
        </Modal>
    </div>
  );
};

export default EnquiryManager;
