import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Badge, Button, Modal, CustomSelect } from '../common/UIComponents';
import { getImageUrl } from '../../utils/imageHelper';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Search, 
  Eye, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  ListFilter 
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const RoomManager = ({ apiBase }) => {
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [viewModal, setViewModal] = useState({ open: false, room: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useSelector(state => state.auth);
  const [dbFacilities, setDbFacilities] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: 1,
    type: 'Rooms',
    capacity: 2,
    amenities: [],
    facilities: []
  });
  const [imagesState, setImagesState] = useState([]); // Array of { file, url, category, isExisting }
  const [isSaving, setIsSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const CATEGORIES = ["General", "Bedroom", "Bathroom", "Living Room", "Exterior", "Other"];
  const FACILITIES = [
    "WiFi", "Air Conditioning", "Mini Bar", "Television", 
    "Room Service", "Balcony", "Sea View", "City View", 
    "Bathtub", "Coffee Maker", "Safe Box", "Breakfast"
  ];

  useEffect(() => {
    fetchRooms();
    fetchFacilities();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiBase}/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setDbCategories(data);
      }
    } catch (err) {
      console.error('Categories Fetch Error:', err);
    }
  };

  const fetchFacilities = async () => {
    try {
      const res = await fetch(`${apiBase}/facilities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setDbFacilities(data);
      }
    } catch (err) {
      console.error('Facilities Fetch Error:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${apiBase}/rooms`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Room Fetch Error:', err);
      toast.error('Failed to sync room inventory');
      setRooms([]);
    }
  };

  const handleEdit = (room) => {
    setIsEditing(true);
    setCurrentRoomId(room._id);
    setFormData({
      name: room.name,
      description: room.description,
      price: room.price,
      quantity: room.quantity,
      type: room.type || 'Rooms',
      capacity: room.capacity || 2,
      amenities: Array.isArray(room.amenities) ? room.amenities : [],
      facilities: room.facilities?.filter(Boolean).map(f => typeof f === 'object' ? f._id : f) || []
    });
    setImagesState((room.images || []).map(img => {
      const url = typeof img === 'string' ? img : img?.url;
      const category = typeof img === 'string' ? 'General' : (img?.category || 'General');
      return {
        url,
        category,
        isExisting: true
      };
    }));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentRoomId(null);
    setFormData({ name: '', description: '', price: '', quantity: 1, type: 'Rooms', capacity: 2, amenities: [], facilities: [] });
    setImagesState([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      category: 'General',
      isExisting: false
    }));
    setImagesState(prev => [...prev, ...newImages]);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) return toast.error('Name and Price are mandatory');
    
    setIsSaving(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'amenities' || key === 'facilities') {
          fd.append(key, JSON.stringify(formData[key]));
        } else {
          fd.append(key, formData[key]);
        }
      });
      
      const existingImages = imagesState.filter(img => img.isExisting).map(img => ({
        url: img.url,
        category: img.category
      }));
      fd.append('existingImages', JSON.stringify(existingImages));

      const newImages = imagesState.filter(img => !img.isExisting);
      newImages.forEach(img => fd.append('images', img.file));
      
      const newImageCategories = newImages.map(img => img.category);
      fd.append('imageCategories', JSON.stringify(newImageCategories));

      const url = isEditing ? `${apiBase}/rooms/${currentRoomId}` : `${apiBase}/rooms`;
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });

      if (res.ok) {
        toast.success(isEditing ? 'Suite updated successfully' : 'New luxury suite initialized');
        handleCloseModal();
        fetchRooms();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Operation failed');
      }
    } catch (err) {
      toast.error('Network synchronization failure');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiBase}/rooms/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRooms(prev => prev.filter(r => r._id !== deleteModal.id));
        setDeleteModal({ open: false, id: null });
        toast.success('Suite removed from inventory');
      } else {
        toast.error('Deletion protocol failed');
      }
    } catch (err) {
      toast.error('Network synchronization failure');
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = 
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        room.description.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesType = typeFilter === 'All' || room.type === typeFilter;
      
      const matchesStatus = 
        statusFilter === 'All' || 
        (statusFilter === 'Available' && room.quantity > 0) || 
        (statusFilter === 'Sold Out' && room.quantity === 0);
        
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rooms, searchTerm, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedData = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="glass-card rounded-luxury overflow-hidden">
      {/* Header Section */}
      <div className="card-padding border-b border-border-subtle space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
              <h3 className="text-[20px] font-bold text-text-primary tracking-tight flex items-center gap-3">
                Stay Management
                <span className="px-2 py-0.5 bg-bg-primary-subtle text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                  {filteredRooms.length} / {rooms.length}
                </span>
              </h3>
              <p className="text-[12px] font-medium text-text-secondary uppercase tracking-widest mt-1">Live Inventory Control</p>
          </div>
          <button className="px-6 py-2.5 active-teal-gradient text-white rounded-xl text-[11px] font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 uppercase tracking-widest" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> + Add New Suite
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by suite name or properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bg-subtle border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-[13px] outline-none focus:bg-bg-subtle focus:border-border-primary-subtle text-text-primary font-medium transition-all"
            />
          </div>
          
          <div className="flex gap-3 shrink-0 max-md:w-full">
            <div className="flex items-center gap-2 max-md:flex-1">
              <span className="text-[11px] font-bold text-text-secondary uppercase">Type:</span>
              <CustomSelect 
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { value: 'All', label: 'All Categories' },
                  ...(dbCategories.filter(cat => cat.type === 'room').length > 0
                    ? dbCategories.filter(cat => cat.type === 'room').map(cat => ({ value: cat.title, label: cat.title }))
                    : [
                        { value: 'Rooms', label: 'Rooms' },
                        { value: 'Combo Offer', label: 'Combo Offer' }
                      ])
                ]}
                className="w-[140px] max-md:w-full"
              />
            </div>
            
            <div className="flex items-center gap-2 max-md:flex-1">
              <span className="text-[11px] font-bold text-text-secondary uppercase">Status:</span>
              <CustomSelect 
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'All', label: 'All Status' },
                  { value: 'Available', label: 'Available' },
                  { value: 'Sold Out', label: 'Sold Out' }
                ]}
                className="w-[145px] max-md:w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="pl-8">Estate Suite Distribution</th>
              <th>Status Log</th>
              <th className="text-right">Valuation</th>
              <th className="text-center pr-8">Operational Controls</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginatedData.length > 0 ? paginatedData.map(room => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={room._id} 
                  className="group cursor-pointer"
                >
                  <td className="pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-[42px] h-[42px] rounded-xl bg-bg-subtle overflow-hidden flex items-center justify-center border border-border-subtle group-hover:border-border-primary-subtle transition-all shrink-0">
                        {room.images && room.images.length > 0 ? (
                            <img src={getImageUrl(room.images[0].url || room.images[0], apiBase)} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <ImageIcon size={18} className="text-text-secondary group-hover:text-primary transition-all" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary truncate tracking-tight text-[15px]">{room.name}</p>
                        <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider mt-0.5 truncate w-72">{room.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                      <Badge status={room.quantity > 0 ? "success" : "danger"}>
                          {room.quantity} Units Available
                      </Badge>
                  </td>
                  <td className="text-right">
                      <p className="font-black text-text-primary text-[15px] tracking-tight">₹{room.price}</p>
                      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-0.5">Per Night</p>
                  </td>
                  <td className="pr-8">
                    <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-primary hover:bg-primary/5 hover:border-border-primary-subtle transition-all"
                        onClick={(e) => { e.stopPropagation(); setViewModal({ open: true, room: room }); }}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-cyan-400 hover:bg-cyan-400/5 hover:border-cyan-400/20 transition-all"
                        onClick={(e) => { e.stopPropagation(); handleEdit(room); }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <div className="w-px h-4 bg-bg-subtle mx-1" />
                      <button 
                        className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/20 transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({ open: true, id: room._id });
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-bg-subtle border border-dashed border-border-subtle flex items-center justify-center">
                        <ImageIcon size={20} className="text-text-secondary opacity-20" />
                      </div>
                      <p className="text-text-secondary text-[12px] font-semibold uppercase tracking-[0.2em]">No luxury suites discovered</p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Confirm Suite Removal"
        footer={
            <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>Confirm Deletion</Button>
            </div>
        }
      >
        <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <Trash2 size={32} />
            </div>
            <div>
                <h4 className="text-white font-bold text-lg">Remove this luxury suite?</h4>
                <p className="text-text-secondary text-sm mt-2">This will permanently erase the suite data from your inventory. All associated media assets will be unlinked.</p>
            </div>
        </div>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, room: null })}
        title="Suite Intelligence Report"
        footer={
            <Button variant="secondary" onClick={() => setViewModal({ open: false, room: null })}>Close Report</Button>
        }
      >
        {viewModal.room && (
            <div className="space-y-6">
                {viewModal.room.images && viewModal.room.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 h-64 rounded-3xl overflow-hidden border border-border-subtle relative">
                            <img src={getImageUrl(viewModal.room.images[0].url || viewModal.room.images[0], apiBase)} className="w-full h-full object-cover" alt="" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Badge status="primary">{viewModal.room.images[0].category}</Badge>
                                <Badge status="success">{viewModal.room.type}</Badge>
                            </div>
                        </div>
                        {viewModal.room.images.slice(1, 3).map((img, i) => (
                            <div key={i} className="h-32 rounded-2xl overflow-hidden border border-border-subtle relative">
                                <img src={getImageUrl(img.url || img, apiBase)} className="w-full h-full object-cover" alt="" />
                                <div className="absolute top-2 right-2">
                                    <Badge status="primary" className="text-[8px] px-1.5 py-0.5">{img.category}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-xl font-bold text-white tracking-tight leading-tight">{viewModal.room.name}</h4>
                            <p className="text-[11px] text-text-secondary font-black uppercase tracking-[0.2em] mt-1">Property Identification</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-primary tracking-tighter">₹{viewModal.room.price}</p>
                            <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">Per Session Cycle</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl text-center">
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Capacity</p>
                            <p className="text-sm font-bold text-white">{viewModal.room.capacity} Guests</p>
                        </div>
                        <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl text-center">
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Inventory</p>
                            <p className="text-sm font-bold text-white">{viewModal.room.quantity} Units</p>
                        </div>
                        <div className="p-4 bg-bg-subtle border border-border-subtle rounded-2xl text-center">
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Status</p>
                            <Badge status={viewModal.room.quantity > 0 ? "success" : "danger"}>
                                {viewModal.room.quantity > 0 ? "Operational" : "Depleted"}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Narrative Analysis</label>
                        <div className="bg-bg-subtle border border-border-subtle rounded-2xl p-5 text-sm text-text-primary leading-relaxed italic">
                            "{viewModal.room.description}"
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Integrated Amenities</label>
                        <div className="flex flex-wrap gap-2">
                            {viewModal.room.amenities?.map((a, i) => (
                                <span key={i} className="px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-black rounded-lg border border-border-primary-subtle uppercase tracking-widest">
                                    {a}
                                </span>
                            ))}
                            {viewModal.room.facilities?.map((f, i) => (
                                <span key={f._id || i} className="px-3 py-1.5 bg-cyan-500/5 text-cyan-400 text-[10px] font-black rounded-lg border border-cyan-500/20 uppercase tracking-widest flex items-center gap-2">
                                    {f.image && <img src={getImageUrl(f.image, apiBase)} className="w-3 h-3 object-contain" alt="" />}
                                    {f.title}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? "Modify Luxury Suite" : "Initialize New Suite"}
        footer={
            <div className="flex gap-3">
                <Button variant="secondary" onClick={handleCloseModal}>Discard</Button>
                <Button onClick={handleSave} disabled={isSaving} className="active-teal-gradient">
                    {isSaving ? "Synchronizing..." : (isEditing ? "Update Estate" : "Commence Asset")}
                </Button>
            </div>
        }
      >
        <div className="space-y-6 max-w-[600px] mx-auto py-2">
            {/* Image Upload */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">Suite Visual Assets</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagesState.map((img, i) => (
                        <div key={i} className="space-y-2">
                            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border-subtle group/img">
                                <img src={getImageUrl(img.url, apiBase)} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                    <button type="button" onClick={() => {
                                        setImagesState(prev => prev.filter((_, idx) => idx !== i));
                                    }} className="p-1.5 bg-rose-500 text-white rounded-lg scale-75 group-hover/img:scale-100 transition-transform">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <CustomSelect 
                                value={img.category}
                                onChange={val => {
                                    setImagesState(prev => prev.map((item, idx) => idx === i ? { ...item, category: val } : item));
                                }}
                                options={CATEGORIES.map(c => ({ value: c, label: c }))}
                                className="w-full"
                                variant="small"
                            />
                        </div>
                    ))}
                    {imagesState.length < 30 && (
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-border-subtle flex flex-col items-center justify-center text-text-secondary hover:border-primary hover:text-primary cursor-pointer transition-all">
                            <Plus size={24} />
                            <span className="text-[9px] font-bold uppercase mt-1">Upload</span>
                            <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Suite Designation</label>
                    <input 
                        type="text" 
                        className="w-full bg-bg-subtle border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                        placeholder="e.g. Royal Presidential Suite" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Valuation (Nightly)</label>
                    <input 
                        type="number" 
                        className="w-full bg-bg-subtle border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                        placeholder="Price in INR" 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Inventory Qty</label>
                    <input 
                        type="number" 
                        className="w-full bg-bg-subtle border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Capacity</label>
                    <input 
                        type="number" 
                        className="w-full bg-bg-subtle border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                        value={formData.capacity}
                        onChange={e => setFormData({...formData, capacity: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Room Categories</label>
                    <CustomSelect 
                        value={formData.type}
                        onChange={val => setFormData({...formData, type: val})}
                        options={
                            dbCategories.filter(cat => cat.type === 'room').length > 0
                                ? dbCategories.filter(cat => cat.type === 'room').map(cat => ({ value: cat.title, label: cat.title }))
                                : [
                                    { value: 'Rooms', label: 'Rooms' },
                                    { value: 'Combo Offer', label: 'Combo Offer' }
                                  ]
                        }
                        className="w-full"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Integrated Facilities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {dbFacilities.length > 0 ? dbFacilities.map(facility => {
                        const isSelected = formData.facilities.includes(facility._id);
                        return (
                            <button
                                key={facility._id}
                                type="button"
                                onClick={() => {
                                    const newFacilities = isSelected
                                        ? formData.facilities.filter(id => id !== facility._id)
                                        : [...formData.facilities, facility._id];
                                    setFormData({...formData, facilities: newFacilities});
                                }}
                                className={twMerge(
                                    "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2",
                                    isSelected 
                                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-sm" 
                                        : "bg-bg-subtle border-border-subtle text-text-secondary hover:border-border-primary-subtle"
                                )}
                            >
                                {facility.image && <img src={getImageUrl(facility.image, apiBase)} className="w-4 h-4 object-contain opacity-70" alt="" />}
                                {facility.title}
                            </button>
                        );
                    }) : FACILITIES.map(facility => {
                        const isSelected = formData.amenities.includes(facility);
                        return (
                            <button
                                key={facility}
                                type="button"
                                onClick={() => {
                                    const newAmenities = isSelected
                                        ? formData.amenities.filter(a => a !== facility)
                                        : [...formData.amenities, facility];
                                    setFormData({...formData, amenities: newAmenities});
                                }}
                                className={twMerge(
                                    "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2",
                                    isSelected 
                                        ? "bg-primary/10 border-primary text-primary shadow-sm" 
                                        : "bg-bg-subtle border-border-subtle text-text-secondary hover:border-border-primary-subtle"
                                )}
                            >
                                <div className={twMerge(
                                    "w-1.5 h-1.5 rounded-full",
                                    isSelected ? "bg-primary animate-pulse" : "bg-text-secondary/20"
                                )} />
                                {facility}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Narrative Description</label>
                <textarea 
                    className="w-full bg-bg-subtle border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all h-24 resize-none" 
                    placeholder="Detailed description of the suite..." 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
            </div>
        </div>
      </Modal>

      {/* Footer Section */}
      <div className="card-padding bg-bg-subtle border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-widest">
            Showing <span className="text-text-primary font-black ml-1">{paginatedData.length}</span> of <span className="text-text-primary font-black">{filteredRooms.length}</span> units
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

        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="w-10 h-10 flex items-center justify-center bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-white disabled:opacity-20 transition-all"
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
            className="w-10 h-10 flex items-center justify-center bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-white disabled:opacity-20 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomManager;
