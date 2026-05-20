import React, { useState, useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { Badge, Button, Modal, CustomSelect } from '../common/UIComponents';
import { 
  Trash2, 
  Plus, 
  FileText, 
  Star, 
  Briefcase, 
  Search, 
  Eye, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  ListFilter,
  Camera,
  Upload,
  X,
  FileImage,
  Sparkles,
  Zap,
  Ticket,
  Link as LinkIcon,
  Palette
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const ContentItemManager = ({ type, apiBase }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [viewModal, setViewModal] = useState({ open: false, item: null });
  const [addModal, setAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [formData, setFormData] = useState({ rating: 5, icon: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [dragActiveCover, setDragActiveCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { token } = useSelector(state => state.auth);
  
  const config = {
    blogs: { title: 'Blog Engine', icon: FileText, endpoint: '/blogs' },
    testimonials: { title: 'Guest Reviews', icon: Star, endpoint: '/testimonials' },
    facilities: { title: 'Hotel Facilities', icon: Briefcase, endpoint: '/facilities' },
    banners: { title: 'Promotional Banners', icon: Zap, endpoint: '/banners' },
    offers: { title: 'Special Offers', icon: Ticket, endpoint: '/offers' },
  };

  const active = config[type];

  if (!active) {
    return (
      <div className="glass-card card-padding text-center">
        <p className="text-rose-500 font-bold uppercase tracking-widest text-xs">Error: Invalid Content Type Module ({type})</p>
      </div>
    );
  }

  useEffect(() => {
    fetchItems();
  }, [type]);

  useEffect(() => {
    if (!selectedFile) {
        if (!isEditing) setPreviewUrl(null);
        return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, isEditing]);

  useEffect(() => {
    if (!selectedCoverFile) {
        if (!isEditing) setCoverPreviewUrl(null);
        return;
    }
    const objectUrl = URL.createObjectURL(selectedCoverFile);
    setCoverPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedCoverFile, isEditing]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${apiBase}${active.endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Content Fetch Error:', err);
      toast.error(`Failed to synchronize ${active.title}`);
      setItems([]);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItemId(item._id);
    setFormData({
        title: item.title || '',
        name: item.name || '',
        role: item.role || '',
        content: item.content || '',
        description: item.description || '',
        rating: item.rating || 5,
        icon: item.icon || '',
        subtitle: item.subtitle || '',
        link: item.link || '',
        discount: item.discount || '',
        code: item.code || '',
        color: item.color || 'text-primary'
    });
    if (item.image) {
        setPreviewUrl(`${apiBase.replace('/api', '')}/${item.image}`);
    } else {
        setPreviewUrl(null);
    }
    if (item.coverImage) {
        setCoverPreviewUrl(`${apiBase.replace('/api', '')}/${item.coverImage}`);
    } else {
        setCoverPreviewUrl(null);
    }
    setAddModal(true);
  };

  const handleCloseModal = () => {
    setAddModal(false);
    setIsEditing(false);
    setCurrentItemId(null);
    setFormData({ rating: 5, icon: '', subtitle: '', link: '', discount: '', code: '', color: 'text-primary' });
    setSelectedFile(null);
    setSelectedCoverFile(null);
    setPreviewUrl(null);
    setCoverPreviewUrl(null);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
        const fd = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== undefined && formData[key] !== null) {
                fd.append(key, formData[key]);
            }
        });
        if (selectedFile) fd.append('image', selectedFile);
        if (selectedCoverFile) fd.append('coverImage', selectedCoverFile);

        const url = isEditing 
            ? `${apiBase}${active.endpoint}/${currentItemId}` 
            : `${apiBase}${active.endpoint}`;
        
        const method = isEditing ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: fd
        });

        if (res.ok) {
            toast.success(`${active.title} entry ${isEditing ? 'updated' : 'published'}`);
            handleCloseModal();
            fetchItems();
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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const titleMatch = (item.title || item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const contentMatch = (item.content || item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || contentMatch;
    });
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedData = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="glass-card rounded-luxury overflow-hidden">
      {/* Header Section */}
      <div className="card-padding border-b border-border-subtle space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-[20px] font-bold text-text-primary tracking-tight flex items-center gap-3">
            <div className="bg-bg-primary-subtle p-2 rounded-xl text-primary border border-border-primary-subtle group-hover:scale-110 transition-transform">
              <active.icon size={20} /> 
            </div>
            {active.title}
            <span className="px-2 py-0.5 bg-bg-primary-subtle text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
              {filteredItems.length} / {items.length}
            </span>
          </h3>
          <button onClick={() => setAddModal(true)} className="px-6 py-2.5 active-teal-gradient text-white rounded-xl text-[11px] font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 uppercase tracking-widest">
            <Plus size={16} /> + New Entry
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative group flex-1 max-md:w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder={`Search within ${active.title}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bg-subtle border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-[13px] outline-none focus:bg-bg-subtle focus:border-border-primary-subtle text-text-primary font-medium transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="pl-8">Content Intelligence Domain</th>
              {type === 'testimonials' && <th className="text-center">Rating</th>}
              {type === 'offers' && <th className="text-center">Discount Value</th>}
              <th className="text-center">Lifecycle Status</th>
              <th className="text-center pr-8">Executive Controls</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginatedData.length > 0 ? paginatedData.map(item => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item._id} 
                  className="group cursor-pointer"
                >
                  <td className="pl-8">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img src={`${apiBase.replace('/api', '')}/${item.image}`} alt="" className="w-10 h-10 rounded-xl object-cover border border-border-subtle" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-bg-subtle border border-border-subtle flex items-center justify-center text-text-secondary">
                          <active.icon size={16} />
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="font-bold text-text-primary tracking-tight leading-tight text-[15px] group-hover:text-primary transition-colors">
                            {item.title || item.name}
                            {item.role && <span className="text-[10px] text-primary/60 ml-2 font-black uppercase tracking-widest">{item.role}</span>}
                        </p>
                        <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider line-clamp-1 w-[380px] opacity-60 group-hover:opacity-100 transition-opacity">
                          {item.content || item.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  {type === 'testimonials' && (
                    <td className="text-center">
                        <div className="flex items-center justify-center gap-1 text-primary">
                            {[...Array(item.rating || 5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                    </td>
                  )}
                  {type === 'offers' && (
                    <td className="text-center">
                        <Badge status="primary">{item.discount}</Badge>
                    </td>
                  )}
                  <td className="text-center">
                    <Badge status="success">Operational</Badge>
                  </td>
                  <td className="pr-8">
                    <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-primary hover:bg-primary/5 hover:border-border-primary-subtle transition-all"
                        onClick={(e) => { e.stopPropagation(); setViewModal({ open: true, item: item }); }}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-cyan-400 hover:bg-cyan-400/5 hover:border-cyan-400/20 transition-all"
                        onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <div className="w-px h-4 bg-bg-subtle mx-1" />
                      <button 
                        className="p-2.5 bg-bg-subtle border border-border-subtle rounded-xl text-text-secondary hover:text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/20 transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({ open: true, id: item._id });
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={type === 'testimonials' ? 4 : 3} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-bg-subtle border border-dashed border-border-subtle flex items-center justify-center">
                              <active.icon size={20} className="text-text-secondary opacity-20" />
                          </div>
                          <p className="text-text-secondary text-[12px] font-semibold uppercase tracking-[0.2em]">No intelligence entries discovered</p>
                      </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title={`Confirm ${active.title} Removal`}
        footer={
            <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</Button>
                <Button variant="danger" onClick={async () => {
                    try {
                        const res = await fetch(`${apiBase}${active.endpoint}/${deleteModal.id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (res.ok) {
                            setItems(prev => prev.filter(i => i._id !== deleteModal.id));
                            setDeleteModal({ open: false, id: null });
                            toast.success(`${active.title} entry removed successfully`);
                        } else {
                            toast.error('Deletion protocol failed');
                        }
                    } catch (err) {
                        toast.error('Network synchronization failure');
                    }
                }}>Confirm Deletion</Button>
            </div>
        }
      >
        <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <Trash2 size={32} />
            </div>
            <div>
                <h4 className="text-white font-bold text-lg">Remove this {type === 'blogs' ? 'article' : 'record'}?</h4>
                <p className="text-text-secondary text-sm mt-2">This procedure will permanently delete the content from the {active.title} domain. This cannot be undone.</p>
            </div>
        </div>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, item: null })}
        title={`${active.title} - Detailed Intelligence`}
        footer={
            <Button variant="secondary" onClick={() => setViewModal({ open: false, item: null })}>Close Intelligence</Button>
        }
      >
        {viewModal.item && (
            <div className="space-y-6">
                {viewModal.item.image && (
                    <div className="w-full h-64 rounded-3xl overflow-hidden border border-border-subtle relative group">
                        <img src={`${apiBase.replace('/api', '')}/${viewModal.item.image}`} className="w-full h-full object-cover" alt="intelligence" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <Badge status="success">Operational Asset</Badge>
                        </div>
                    </div>
                )}
                
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h4 className="text-xl font-bold text-white tracking-tight leading-tight">
                            {viewModal.item.title || viewModal.item.name}
                        </h4>
                        {viewModal.item.role && (
                            <p className="text-[11px] text-primary font-black uppercase tracking-[0.2em]">{viewModal.item.role}</p>
                        )}
                    </div>

                    {type === 'testimonials' && (
                        <div className="flex items-center gap-2 p-3 bg-bg-subtle border border-border-subtle rounded-xl w-fit">
                            <div className="flex items-center gap-1 text-primary">
                                {[...Array(viewModal.item.rating || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <span className="text-[11px] font-bold text-text-secondary uppercase">Guest Rating</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Payload Content</label>
                        <div className="bg-bg-subtle border border-border-subtle rounded-2xl p-5 text-sm text-text-primary leading-relaxed italic">
                            "{viewModal.item.content || viewModal.item.description}"
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-bg-subtle border border-border-subtle rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-bg-primary-subtle flex items-center justify-center text-primary">
                                <active.icon size={16} />
                            </div>
                            <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Logged At</span>
                        </div>
                        <span className="text-[12px] text-text-primary font-medium">
                            {new Date(viewModal.item.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        )}
      </Modal>

      <Modal
        isOpen={addModal}
        onClose={handleCloseModal}
        title={isEditing ? `Modify Existing ${active.title}` : `Initialize New ${active.title}`}
        footer={
            <div className="flex gap-3">
                <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handlePublish} disabled={isSaving} className="active-teal-gradient">
                    {isSaving ? "Synchronizing..." : (isEditing ? "Update Estate" : "Commit to Vertical")}
                </Button>
            </div>
        }
      >
        <div className="space-y-8 max-w-[580px] mx-auto py-2">
            {type === 'testimonials' ? (
                <>
                    {/* Visual Asset Section - Prominent Drag & Drop */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                            <Camera size={14} className="text-primary" /> Visual Asset Integration
                        </label>
                        <div 
                            className={`relative group transition-all duration-500 ${dragActive ? 'scale-[1.02]' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input 
                                type="file" 
                                className="hidden" 
                                id="testimonial-image"
                                onChange={e => setSelectedFile(e.target.files[0])}
                                accept="image/*"
                            />
                            <label 
                                htmlFor="testimonial-image" 
                                className={`flex flex-col items-center justify-center gap-4 py-12 border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-500 ${
                                    dragActive 
                                    ? 'border-primary bg-bg-primary-subtle' 
                                    : 'border-border-subtle bg-bg-subtle hover:border-border-primary-subtle hover:bg-bg-subtle'
                                }`}
                            >
                                {previewUrl ? (
                                    <div className="relative group/preview">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border-primary-subtle shadow-2xl relative z-10">
                                            <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                                        </div>
                                        <div className="absolute inset-0 bg-bg-primary-subtle blur-2xl rounded-full animate-pulse" />
                                        <button 
                                            onClick={(e) => { e.preventDefault(); setSelectedFile(null); if (isEditing) setPreviewUrl(null); }}
                                            className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full z-20 shadow-lg hover:scale-110 transition-transform"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-bg-subtle rounded-full flex items-center justify-center text-text-secondary border border-border-subtle group-hover:text-primary group-hover:border-border-primary-subtle transition-all">
                                            <Upload size={28} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[13px] font-bold text-text-primary tracking-tight">Drop Guest Photo or Browse</p>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-[0.1em] mt-1 font-medium">JPG, PNG or WEBP • Maximum 5MB</p>
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Identity & Role Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Guest Identity</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    className="w-full bg-bg-subtle border border-border-subtle rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle focus:bg-bg-subtle transition-all" 
                                    placeholder="Enter full name..." 
                                    value={formData.name || ''}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Professional Role</label>
                            <input 
                                type="text" 
                                className="w-full bg-bg-subtle border border-border-subtle rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle focus:bg-bg-subtle transition-all" 
                                placeholder="e.g. Executive Guest..." 
                                value={formData.role || ''}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1 flex justify-between">
                            <span>Experience Narrative</span>
                            <span className="text-primary/40 italic font-medium normal-case">Neural synchronization active</span>
                        </label>
                        <textarea 
                            className="w-full bg-bg-subtle border border-border-subtle rounded-[24px] p-5 text-sm text-text-primary outline-none focus:border-border-primary-subtle focus:bg-bg-subtle transition-all h-32 resize-none leading-relaxed" 
                            placeholder="Type the guest's experience story here..." 
                            value={formData.content || ''}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                        />
                    </div>

                    {/* Rating Section */}
                    <div className="p-6 bg-bg-subtle border border-border-subtle rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold text-text-primary uppercase tracking-widest">Satisfaction Matrix</p>
                            <p className="text-[9px] text-text-secondary uppercase tracking-widest">Selected: {formData.rating} Stars</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {[1,2,3,4,5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({...formData, rating: star})}
                                    className={`p-2 rounded-xl transition-all ${
                                        formData.rating >= star 
                                        ? 'text-primary bg-bg-primary-subtle scale-110 shadow-lg shadow-primary/10' 
                                        : 'text-white/10 hover:text-primary/40 hover:bg-bg-subtle'
                                    }`}
                                >
                                    <Star size={24} fill={formData.rating >= star ? "currentColor" : "none"} strokeWidth={2} />
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Standard Layout for Blogs/Services */}
                    <div className="space-y-6">
                        <div 
                            className={`relative group transition-all duration-500 ${dragActive ? 'scale-[1.01]' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input 
                                type="file" 
                                className="hidden" 
                                id="blog-image"
                                onChange={e => setSelectedFile(e.target.files[0])}
                            />
                            <label htmlFor="blog-image" className={`flex flex-col items-center justify-center gap-4 py-20 border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-500 ${
                                dragActive 
                                ? 'border-primary bg-bg-primary-subtle' 
                                : 'border-border-subtle bg-bg-subtle hover:border-border-primary-subtle hover:bg-bg-subtle'
                            }`}>
                                {previewUrl ? (
                                    <div className="relative w-full px-6">
                                        <img src={previewUrl} className="w-full h-48 object-cover rounded-2xl border border-border-subtle" alt="preview" />
                                        <button 
                                            onClick={(e) => { e.preventDefault(); setSelectedFile(null); if (isEditing) setPreviewUrl(null); }}
                                            className="absolute top-4 right-10 bg-rose-500 text-white p-2 rounded-full shadow-xl hover:scale-110 transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-bg-subtle rounded-full flex items-center justify-center text-text-secondary border border-border-subtle">
                                            <FileImage size={28} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[13px] font-bold text-text-primary tracking-tight">Synchronize Media Header</p>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-[0.1em] mt-1 font-medium">Drag assets or browse local directory</p>
                                        </div>
                                    </>
                                )}
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Domain Heading</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-bg-subtle border border-border-subtle rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                                        placeholder="Enter subject..." 
                                        value={formData.title || ''}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                {type === 'facilities' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Icon Class/Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-bg-subtle border border-border-subtle rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                                            placeholder="e.g. coffee, pool..." 
                                            value={formData.icon || ''}
                                            onChange={e => setFormData({...formData, icon: e.target.value})}
                                        />
                                    </div>
                                )}
                            </div>

                            {type === 'facilities' && (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">Cover Image Integration</label>
                                    <div 
                                        className={`relative group transition-all duration-500 ${dragActiveCover ? 'scale-[1.01]' : ''}`}
                                        onDragEnter={(e) => { e.preventDefault(); setDragActiveCover(true); }}
                                        onDragLeave={(e) => { e.preventDefault(); setDragActiveCover(false); }}
                                        onDragOver={(e) => { e.preventDefault(); setDragActiveCover(true); }}
                                        onDrop={(e) => { e.preventDefault(); setDragActiveCover(false); if(e.dataTransfer.files[0]) setSelectedCoverFile(e.dataTransfer.files[0]); }}
                                    >
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            id="cover-image"
                                            onChange={e => setSelectedCoverFile(e.target.files[0])}
                                        />
                                        <label htmlFor="cover-image" className={`flex flex-col items-center justify-center gap-4 py-12 border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-500 ${
                                            dragActiveCover 
                                            ? 'border-primary bg-bg-primary-subtle' 
                                            : 'border-border-subtle bg-bg-subtle hover:border-border-primary-subtle hover:bg-bg-subtle'
                                        }`}>
                                            {coverPreviewUrl ? (
                                                <div className="relative w-full px-6">
                                                    <img src={coverPreviewUrl} className="w-full h-32 object-cover rounded-2xl border border-border-subtle" alt="preview" />
                                                    <button 
                                                        onClick={(e) => { e.preventDefault(); setSelectedCoverFile(null); if (isEditing) setCoverPreviewUrl(null); }}
                                                        className="absolute top-2 right-8 bg-rose-500 text-white p-1.5 rounded-full shadow-xl hover:scale-110 transition-all"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <p className="text-[12px] font-bold text-text-primary">Upload Cover Image</p>
                                                    <p className="text-[9px] text-text-secondary uppercase tracking-widest mt-1">Wide display asset</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Payload Content</label>
                                <textarea 
                                    className="w-full bg-bg-subtle border border-border-subtle rounded-[24px] p-5 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all h-32 resize-none leading-relaxed" 
                                    placeholder="Enter full intelligence payload..." 
                                    value={formData.content || formData.description || ''}
                                    onChange={e => setFormData({...formData, content: e.target.value, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {type === 'banners' && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Banner Title</label>
                        <input 
                            type="text" 
                            className="w-full bg-bg-subtle border border-border-subtle rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                            placeholder="Enter main heading..." 
                            value={formData.title || ''}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Subtitle / Callout</label>
                        <input 
                            type="text" 
                            className="w-full bg-bg-subtle border border-border-subtle rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                            placeholder="Enter supporting text..." 
                            value={formData.subtitle || ''}
                            onChange={e => setFormData({...formData, subtitle: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                            <LinkIcon size={14} className="text-primary" /> Target Link
                        </label>
                        <input 
                            type="text" 
                            className="w-full bg-bg-subtle border border-border-subtle rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                            placeholder="e.g. /rooms, #promotion..." 
                            value={formData.link || ''}
                            onChange={e => setFormData({...formData, link: e.target.value})}
                        />
                    </div>
                </div>
            )}

            {type === 'offers' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Offer Title</label>
                            <input 
                                type="text" 
                                className="w-full bg-bg-subtle border border-border-subtle rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                                placeholder="e.g. Summer Special..." 
                                value={formData.title || ''}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Discount Text</label>
                            <input 
                                type="text" 
                                className="w-full bg-bg-subtle border border-border-subtle rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                                placeholder="e.g. 30% OFF, ₹500 Flat..." 
                                value={formData.discount || ''}
                                onChange={e => setFormData({...formData, discount: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Promo Code</label>
                            <input 
                                type="text" 
                                className="w-full bg-bg-subtle border border-border-subtle rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all" 
                                placeholder="e.g. SUMMER2026..." 
                                value={formData.code || ''}
                                onChange={e => setFormData({...formData, code: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Palette size={14} className="text-primary" /> UI Theme Color
                            </label>
                            <CustomSelect 
                                value={formData.color || 'text-primary'}
                                onChange={(val) => setFormData({...formData, color: val})}
                                options={[
                                    { value: 'text-primary', label: 'Teal (Default)' },
                                    { value: 'text-amber-400', label: 'Amber' },
                                    { value: 'text-emerald-400', label: 'Emerald' },
                                    { value: 'text-rose-400', label: 'Rose' },
                                    { value: 'text-cyan-400', label: 'Cyan' },
                                ]}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Short Description</label>
                        <textarea 
                            className="w-full bg-bg-subtle border border-border-subtle rounded-[24px] p-5 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all h-24 resize-none leading-relaxed" 
                            placeholder="Explain the offer terms..." 
                            value={formData.description || ''}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                </div>
            )}

            {/* Verification Badge */}
            <div className="p-5 bg-primary/5 border border-border-primary-subtle rounded-[28px] flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-700">
                    <Sparkles size={48} className="text-primary" />
                </div>
                <div className="bg-bg-primary-subtle p-2.5 rounded-xl text-primary">
                    <active.icon size={20} />
                </div>
                <div className="space-y-0.5">
                    <p className="text-[11px] text-primary font-black uppercase tracking-widest">Protocol Verification</p>
                    <p className="text-[10px] text-primary/60 font-medium italic">Synchronizing entry to the {active.title} vertical.</p>
                </div>
            </div>
        </div>
      </Modal>

      {/* Footer Section */}
      <div className="card-padding bg-bg-subtle border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-widest">
            Synchronized <span className="text-text-primary font-black ml-1">{paginatedData.length}</span> of <span className="text-text-primary font-black">{filteredItems.length}</span> entries
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

export default ContentItemManager;
