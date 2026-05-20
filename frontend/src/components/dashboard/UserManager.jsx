import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchUsersRequest, 
  addUserRequest, 
  updateUserRequest, 
  deleteUserRequest 
} from '../../redux/slices/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, Edit3, Trash2, ChevronLeft, ChevronRight, Eye, Ban } from 'lucide-react';
import { Modal, Button, CustomSelect, Badge } from '../common/UIComponents';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

const UserManager = ({ apiBase }) => {
  const dispatch = useDispatch();
  const { users, loading, error: reduxError } = useSelector(state => state.users);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [viewModal, setViewModal] = useState({ open: false, user: null });
  const [formData, setFormData] = useState({ username: '', email: '', role: 'admin', permissions: [] });
  const [editData, setEditData] = useState({ role: '', isActive: true, permissions: [] });
  const { token, user: currentUser } = useSelector(state => state.auth);

  const SECTIONS = [
    'dashboard', 'enquiries', 'contact_messages', 'social', 'testimonials', 
    'gallery', 'blogs', 'facilities', 'rooms', 'bookings', 
    'availability', 'users', 'settings'
  ];

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  // Handle toast notifications for redux errors
  useEffect(() => {
    if (reduxError) {
        toast.error(reduxError);
    }
  }, [reduxError]);

  const handleUpdateUser = () => {
    dispatch(updateUserRequest({ 
        id: editModal.user._id, 
        data: editData 
    }));
    setEditModal({ open: false, user: null });
  };

  const handleToggleStatus = (userToToggle) => {
    if (userToToggle._id === currentUser.id) {
        toast.error("Safety Protocol: Cannot suspend self");
        return;
    }
    dispatch(updateUserRequest({ 
        id: userToToggle._id, 
        data: { isActive: !userToToggle.isActive } 
    }));
  };

  const handleAddUser = () => {
    dispatch(addUserRequest(formData));
    setAddModal(false);
    setFormData({ username: '', email: '', role: 'admin', permissions: [] });
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedData = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const confirmDelete = () => {
    dispatch(deleteUserRequest(deleteModal.id));
    setDeleteModal({ open: false, id: null });
  };

  if (loading) return <div className="py-20 text-center animate-pulse uppercase tracking-widest text-text-secondary">Loading Personnel...</div>;

  return (
    <div className="glass-card rounded-luxury overflow-hidden">
      <div className="card-padding border-b border-border-subtle space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
                <h3 className="text-[20px] font-bold text-text-primary tracking-tight flex items-center gap-3">
                    Personnel Access Control
                    <span className="px-2 py-0.5 bg-bg-primary-subtle text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                        {filteredUsers.length} / {users.length}
                    </span>
                </h3>
                <p className="text-[12px] font-medium text-text-secondary uppercase tracking-widest mt-1">Live Security Authorization</p>
            </div>
            <button onClick={() => setAddModal(true)} className="px-6 py-2.5 active-teal-gradient text-white rounded-xl text-[11px] font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 uppercase tracking-widest">
                <PlusCircle size={16} /> + Add New Officer
            </button>
        </div>
        <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
            <input 
                type="text" 
                placeholder="Search Security Identities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bg-subtle border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-[13px] outline-none focus:bg-bg-subtle focus:border-border-primary-subtle text-text-primary font-medium transition-all"
            />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="pl-8">Identity Domain</th>
              <th>System Role</th>
              <th>Communication</th>
              <th>Status</th>
              <th className="text-center pr-8">Operational Controls</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
                {paginatedData.map(u => (
                <motion.tr 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={u._id} 
                    className="group cursor-pointer"
                >
                    <td className="pl-8">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center text-primary font-bold text-[13px]">
                        {u.username.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-bold text-text-primary tracking-tight text-[15px]">{u.username}</p>
                    </div>
                    </td>
                    <td>
                    <span className="text-[11px] font-black text-text-secondary uppercase tracking-[0.1em] px-3 py-1 bg-bg-subtle border border-border-subtle rounded-lg">
                        {u.role.replace('_', ' ')}
                    </span>
                    </td>
                    <td className="text-[13px] text-text-secondary font-medium lowercase">
                    {u.email}
                    </td>
                    <td>
                    <Badge status={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Offline'}</Badge>
                    </td>
                    <td className="pr-8">
                        <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => setViewModal({ open: true, user: u })}
                                className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-primary hover:bg-primary/5 hover:border-border-primary-subtle transition-all"
                            >
                                <Eye size={16} />
                            </button>
                            <button 
                                onClick={() => {
                                    setEditData({ role: u.role, isActive: u.isActive, permissions: u.permissions });
                                    setEditModal({ open: true, user: u });
                                }}
                                className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-cyan-400 hover:bg-cyan-400/5 hover:border-cyan-400/20 transition-all"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button 
                                onClick={() => handleToggleStatus(u)}
                                className={twMerge(
                                    "p-2.5 bg-bg-subtle border border-border-subtle rounded-xl transition-all",
                                    u.isActive 
                                        ? "text-text-secondary hover:text-amber-500 hover:bg-amber-500/5 hover:border-amber-500/20" 
                                        : "text-emerald-500 bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                                )}
                                title={u.isActive ? "Suspend Access" : "Restore Access"}
                            >
                                <Ban size={16} className={!u.isActive ? "rotate-180" : ""} />
                            </button>
                            <button 
                                className={`p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary transition-all ${
                                    u.role === 'super_admin' && currentUser.role !== 'super_admin'
                                    ? 'opacity-20 cursor-not-allowed'
                                    : 'hover:text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/20'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (u.role === 'super_admin' && currentUser.role !== 'super_admin') return;
                                    setDeleteModal({ open: true, id: u._id });
                                }}
                                disabled={u.role === 'super_admin' && currentUser.role !== 'super_admin'}
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

      <div className="card-padding bg-bg-subtle border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-widest">
                    Showing <span className="text-text-primary font-black ml-1">{paginatedData.length}</span> of <span className="text-text-primary font-black">{filteredUsers.length}</span> personnel
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

        {/* Edit Officer Modal */}
        <Modal
            isOpen={editModal.open}
            onClose={() => setEditModal({ open: false, user: null })}
            title={`Adjust Personnel: ${editModal.user?.username}`}
            footer={
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setEditModal({ open: false, user: null })}>Cancel</Button>
                    <Button onClick={handleUpdateUser}>Apply Corrections</Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <CustomSelect 
                        label="Modified Access Level"
                        value={editData.role}
                        onChange={(val) => setEditData({...editData, role: val})}
                        options={[
                            { value: 'admin', label: 'Admin Officer' },
                            { value: 'manager', label: 'Content Manager' }
                        ]}
                    />
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Account Status (Suspension)</label>
                        <div 
                            onClick={() => {
                                if (editModal.user?._id === currentUser.id) {
                                    toast.error("Safety Protocol: Cannot suspend self");
                                    return;
                                }
                                setEditData({...editData, isActive: !editData.isActive});
                            }}
                            className={twMerge(
                                "w-full rounded-xl p-3 text-[11px] font-bold uppercase tracking-widest cursor-pointer transition-all border flex items-center justify-between",
                                editData.isActive 
                                    ? "bg-primary/5 border-border-primary-subtle text-primary" 
                                    : "bg-rose-500/5 border-rose-500/20 text-rose-500"
                            )}
                        >
                            {editData.isActive ? 'Active Duty' : 'Suspended / Deactivated'}
                            <div className={twMerge(
                                "w-4 h-4 rounded-full border-2",
                                editData.isActive ? "bg-primary border-border-subtle" : "bg-transparent border-rose-500/40"
                            )} />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Section Access Matrix</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SECTIONS.map(section => {
                            const isSelected = editData.permissions.includes(section);
                            return (
                                <button
                                    key={section}
                                    type="button"
                                    onClick={() => {
                                        const newPermissions = isSelected
                                            ? editData.permissions.filter(p => p !== section)
                                            : [...editData.permissions, section];
                                        setEditData({...editData, permissions: newPermissions});
                                    }}
                                    className={twMerge(
                                        "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2",
                                        isSelected 
                                            ? "bg-primary/10 border-primary text-primary" 
                                            : "bg-bg-subtle border-border-subtle text-text-secondary hover:border-border-primary-subtle"
                                    )}
                                >
                                    {section.replace('_', ' ')}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Modal>

        {/* View Personnel Detail Modal */}
        <Modal
            isOpen={viewModal.open}
            onClose={() => setViewModal({ open: false, user: null })}
            title="Personnel Identity Report"
            footer={
                <Button variant="secondary" onClick={() => setViewModal({ open: false, user: null })}>Close Report</Button>
            }
        >
            {viewModal.user && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-5 bg-bg-subtle border border-border-subtle rounded-[24px]">
                        <div className="w-12 h-12 rounded-xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center text-xl font-bold text-primary">
                            {viewModal.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white">{viewModal.user.username}</h4>
                            <p className="text-xs text-text-secondary uppercase tracking-widest font-black">{viewModal.user.role.replace('_', ' ')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 p-4 bg-bg-subtle border border-border-subtle rounded-xl">
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Communication Channel</p>
                            <p className="text-[13px] text-text-primary font-medium">{viewModal.user.email}</p>
                        </div>
                        <div className="space-y-1.5 p-4 bg-bg-subtle border border-border-subtle rounded-xl">
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">System Status</p>
                            <Badge status={viewModal.user.isActive ? 'success' : 'danger'}>{viewModal.user.isActive ? 'Active Duty' : 'Suspended'}</Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Capability Matrix (Permissions)</label>
                        <div className="flex flex-wrap gap-2">
                            {viewModal.user.permissions?.length > 0 ? (
                                viewModal.user.permissions.map((p, i) => (
                                    <span key={i} className="px-3 py-1 bg-primary/5 text-primary text-[11px] font-bold rounded-lg border border-border-primary-subtle uppercase tracking-tight">
                                        {p}
                                    </span>
                                ))
                            ) : (
                                <p className="text-[11px] text-text-secondary italic">No granular permissions assigned</p>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-bg-subtle border border-border-subtle rounded-xl flex justify-between items-center">
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Registration Date</span>
                        <span className="text-[12px] text-text-primary font-medium">{new Date(viewModal.user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
            isOpen={deleteModal.open}
            onClose={() => setDeleteModal({ open: false, id: null })}
            title="Confirm Termination"
            footer={
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Terminate Access</Button>
                </div>
            }
        >
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                    <Trash2 size={32} />
                </div>
                <div>
                    <h4 className="text-white font-bold text-lg">Are you absolutely sure?</h4>
                    <p className="text-text-secondary text-sm mt-2">This action will immediately revoke all system access for this officer. This procedure is irreversible within the current session context.</p>
                </div>
            </div>
        </Modal>

        {/* Add Officer Modal */}
        <Modal
            isOpen={addModal}
            onClose={() => setAddModal(false)}
            title="Register New Personnel"
            footer={
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
                    <Button onClick={handleAddUser}>Initialize Access</Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Officer Identity</label>
                        <input 
                            type="text" 
                            className="w-full bg-bg-subtle border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                            placeholder="Enter username..." 
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    <CustomSelect 
                        label="Access Level"
                        value={formData.role}
                        onChange={(val) => setFormData({...formData, role: val})}
                        options={[
                            { value: 'admin', label: 'Admin Officer' },
                            { value: 'manager', label: 'Content Manager' }
                        ]}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Secure Communication (Email)</label>
                    <input 
                        type="email" 
                        className="w-full bg-bg-subtle border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                        placeholder="officer@lakebreeze.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Section Access Matrix</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SECTIONS.map(section => {
                            const isSelected = formData.permissions.includes(section);
                            return (
                                <button
                                    key={section}
                                    type="button"
                                    onClick={() => {
                                        const newPermissions = isSelected
                                            ? formData.permissions.filter(p => p !== section)
                                            : [...formData.permissions, section];
                                        setFormData({...formData, permissions: newPermissions});
                                    }}
                                    className={twMerge(
                                        "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2",
                                        isSelected 
                                            ? "bg-primary/10 border-primary text-primary" 
                                            : "bg-bg-subtle border-border-subtle text-text-secondary hover:border-border-primary-subtle"
                                    )}
                                >
                                    {section.replace('_', ' ')}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 bg-primary/5 border border-border-primary-subtle rounded-2xl">
                    <p className="text-[11px] text-primary font-medium italic text-center">System will automatically generate a temporary secure key for first-time authentication.</p>
                </div>
            </div>
        </Modal>
    </div>
  );
};

export default UserManager;
