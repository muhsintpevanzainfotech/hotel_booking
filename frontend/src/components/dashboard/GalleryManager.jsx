import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Upload, Folder, Plus, X, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, Button } from '../common/UIComponents';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageHelper';

const GalleryManager = ({ apiBase }) => {
  const [images, setImages] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [viewModal, setViewModal] = useState({ open: false, img: null });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${apiBase}/gallery`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to synchronize gallery');
      setImages([]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return toast.error('Please select assets to transmit');
    
    setLoading(true);
    try {
        const formData = new FormData();
        Array.from(selectedFiles).forEach(file => {
            formData.append('images', file);
        });

        const res = await fetch(`${apiBase}/gallery`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (res.ok) {
            toast.success('Visual assets synchronized successfully');
            setAddModal(false);
            setSelectedFiles([]);
            fetchGallery();
        } else {
            toast.error('Asset synchronization failed');
        }
    } catch (err) {
        toast.error('Network protocol error');
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
        const res = await fetch(`${apiBase}/gallery/${deleteModal.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setImages(prev => prev.filter(img => img._id !== deleteModal.id));
            setDeleteModal({ open: false, id: null });
            toast.success('Asset removed from library');
        }
    } catch (err) {
        toast.error('Deletion protocol failed');
    }
  };

  return (
    <div className="space-y-[24px]">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
            <h3 className="text-[18px] font-bold text-text-primary tracking-tight border-l-[3px] border-primary pl-4 leading-none uppercase">Visual Asset Library</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] pl-4 font-black">Centralized Media Hub</p>
        </div>
        <button 
            onClick={() => setAddModal(true)}
            className="px-6 py-2.5 active-teal-gradient text-white rounded-xl text-[11px] font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 uppercase tracking-widest"
        >
            <Upload size={16} /> Transmit Assets
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {images.length === 0 ? (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-32 space-y-[24px] bg-bg-subtle rounded-[32px] border border-dashed border-border-subtle"
            >
                <div className="bg-bg-primary-subtle p-8 rounded-full text-primary border border-border-primary-subtle">
                    <ImageIcon size={48} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                    <p className="text-text-primary font-bold text-[18px] tracking-tight uppercase">No assets discovered</p>
                    <p className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.2em] mt-2">Initialize your vertical media feed</p>
                </div>
                <button 
                    onClick={() => setAddModal(true)}
                    className="px-8 py-3 bg-bg-subtle border border-border-subtle text-text-primary rounded-xl text-[11px] font-black hover:bg-primary hover:border-primary transition-all uppercase tracking-[0.2em]"
                >
                    <Plus size={16} className="inline mr-2" /> Populating Feed
                </button>
            </motion.div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
                {images.map((img) => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={img._id} 
                        className="group relative aspect-square rounded-[24px] overflow-hidden border border-border-subtle bg-bg-subtle cursor-pointer"
                    >
                        <img src={getImageUrl(img.image, apiBase)} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                            <button 
                                onClick={() => setViewModal({ open: true, img: img })}
                                className="p-3 bg-primary text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                            >
                                <Eye size={18} />
                            </button>
                            <button 
                                onClick={() => setDeleteModal({ open: true, id: img._id })}
                                className="p-3 bg-rose-500 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Confirm Asset Removal"
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
                <h4 className="text-white font-bold text-lg">Remove this visual asset?</h4>
                <p className="text-text-secondary text-sm mt-2">This procedure will permanently delete the selected image from the visual asset library. This cannot be undone.</p>
            </div>
        </div>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, img: null })}
        title="Visual Asset Inspection"
        footer={
            <Button variant="secondary" onClick={() => setViewModal({ open: false, img: null })}>Close Viewport</Button>
        }
      >
        {viewModal.img && (
            <div className="space-y-6">
                <div className="w-full rounded-[32px] overflow-hidden border border-border-subtle bg-bg-subtle aspect-video md:aspect-auto">
                    <img 
                        src={getImageUrl(viewModal.img.image, apiBase)} 
                        className="w-full h-auto object-contain max-h-[70vh]" 
                        alt="inspection" 
                    />
                </div>
                
                <div className="flex justify-between items-center p-5 bg-bg-subtle border border-border-subtle rounded-[24px]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-bg-primary-subtle flex items-center justify-center text-primary border border-border-primary-subtle">
                            <ImageIcon size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] text-text-secondary uppercase tracking-[0.2em] font-black">Asset Signature</p>
                            <p className="text-sm font-bold text-white tracking-tight">{viewModal.img._id}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-1">Transmission Date</p>
                        <p className="text-[12px] text-text-primary font-medium">{new Date(viewModal.img.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        )}
      </Modal>

      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="Asset Transmission Protocol"
        footer={
            <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
                <Button disabled={loading} onClick={handleUpload}>
                    {loading ? 'Transmitting...' : 'Confirm Upload'}
                </Button>
            </div>
        }
      >
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Visual Intelligence Selection (Bulk)</label>
                <div className="relative">
                    <input 
                        type="file" 
                        multiple 
                        id="gallery-upload"
                        className="hidden" 
                        onChange={e => setSelectedFiles(e.target.files)}
                    />
                    <label htmlFor="gallery-upload" className="w-full h-32 flex flex-col items-center justify-center gap-3 bg-bg-subtle border-2 border-dashed border-border-subtle rounded-[24px] cursor-pointer hover:border-border-primary-subtle hover:bg-primary/5 transition-all group">
                        <div className="p-3 bg-bg-primary-subtle rounded-full text-primary group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                        </div>
                        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                            {selectedFiles.length > 0 ? `${selectedFiles.length} Assets Staged` : 'Drop visuals here or browse'}
                        </p>
                    </label>
                </div>
            </div>

            {selectedFiles.length > 0 && (
                <div className="p-4 bg-primary/5 border border-border-primary-subtle rounded-2xl flex items-center gap-3">
                    <ImageIcon size={18} className="text-primary" />
                    <p className="text-[11px] text-primary font-medium italic">Ready to synchronize {selectedFiles.length} assets to the unified domain.</p>
                </div>
            )}
        </div>
      </Modal>
    </div>
  );
};

export default GalleryManager;
