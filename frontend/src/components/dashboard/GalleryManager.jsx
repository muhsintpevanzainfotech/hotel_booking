import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Upload, Folder, Plus, X, Eye, Check } from 'lucide-react';
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
  
  // Advanced file upload state tracking
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
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

  const isVideoFile = (url) => {
    if (!url) return false;
    return /\.(mp4|mov|webm)$/i.test(url);
  };

  const validateFile = (file) => {
    const name = file.name;
    const size = file.size;
    const ext = name.split('.').pop().toLowerCase();
    
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
    const isVideo = ['mp4', 'mov', 'webm'].includes(ext);
    
    if (!isImage && !isVideo) {
      return { isValid: false, errorMsg: 'Unsupported file format.' };
    }
    if (isImage && size > 5 * 1024 * 1024) {
      return { isValid: false, errorMsg: 'Image size exceeds 5MB limit.' };
    }
    if (isVideo && size > 50 * 1024 * 1024) {
      return { isValid: false, errorMsg: 'Video size exceeds 50MB limit.' };
    }
    
    return { isValid: true, errorMsg: '' };
  };

  const handleFilesAdded = (filesList) => {
    const newFiles = Array.from(filesList).map(file => {
      const validation = validateFile(file);
      return {
        file,
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        previewUrl: file.type.startsWith('image/') || file.type.startsWith('video/') ? URL.createObjectURL(file) : null,
        status: validation.isValid ? 'staged' : 'error',
        progress: 0,
        errorMsg: validation.errorMsg
      };
    });
    
    setStagedFiles(prev => [...prev, ...newFiles]);
  };

  const removeStagedFile = (id) => {
    setStagedFiles(prev => {
      const fileToClose = prev.find(f => f.id === id);
      if (fileToClose && fileToClose.previewUrl) {
        URL.revokeObjectURL(fileToClose.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const clearStagedFiles = () => {
    stagedFiles.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setStagedFiles([]);
  };

  const handleUpload = async () => {
    const validFiles = stagedFiles.filter(f => f.status === 'staged');
    if (validFiles.length === 0) {
      return toast.error('No valid visual assets staged for transmission');
    }
    
    setLoading(true);
    let failedCount = 0;
    let successCount = 0;

    for (const staged of validFiles) {
      // Mark as uploading
      setStagedFiles(prev => prev.map(f => f.id === staged.id ? { ...f, status: 'uploading', progress: 0 } : f));
      
      try {
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          formData.append('images', staged.file);

          xhr.open('POST', `${apiBase}/gallery`);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setStagedFiles(prev => prev.map(f => f.id === staged.id ? { ...f, progress: percentComplete } : f));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setStagedFiles(prev => prev.map(f => f.id === staged.id ? { ...f, status: 'success', progress: 100 } : f));
              successCount++;
              resolve();
            } else {
              let errorMsg = 'Asset transmission failed';
              try {
                const response = JSON.parse(xhr.responseText);
                errorMsg = response.message || errorMsg;
              } catch (e) {}
              setStagedFiles(prev => prev.map(f => f.id === staged.id ? { ...f, status: 'error', errorMsg } : f));
              failedCount++;
              resolve();
            }
          };

          xhr.onerror = () => {
            setStagedFiles(prev => prev.map(f => f.id === staged.id ? { ...f, status: 'error', errorMsg: 'Network error' } : f));
            failedCount++;
            resolve();
          };

          xhr.send(formData);
        });
      } catch (err) {
        setStagedFiles(prev => prev.map(f => f.id === staged.id ? { ...f, status: 'error', errorMsg: err.message } : f));
        failedCount++;
      }
    }
    
    setLoading(false);
    
    if (successCount > 0) {
      toast.success(`${successCount} visual assets synchronized successfully`);
      fetchGallery();
    }
    if (failedCount > 0) {
      toast.error(`${failedCount} assets failed to synchronize`);
    }
    
    // Close modal if all succeeded
    if (failedCount === 0) {
      setTimeout(() => {
        setAddModal(false);
        clearStagedFiles();
      }, 1000);
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
                        {isVideoFile(img.image) ? (
                            <video 
                                src={getImageUrl(img.image, apiBase)} 
                                className="w-full h-full object-cover" 
                                muted 
                                loop
                                playsInline
                                onMouseEnter={(e) => e.target.play().catch(() => {})}
                                onMouseLeave={(e) => e.target.pause()}
                            />
                        ) : (
                            <img src={getImageUrl(img.image, apiBase)} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                            <button 
                                onClick={() => setViewModal({ open: true, img: img })}
                                className="p-3 bg-primary text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl animate-fade"
                            >
                                <Eye size={18} />
                            </button>
                            <button 
                                onClick={() => setDeleteModal({ open: true, id: img._id })}
                                className="p-3 bg-rose-500 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl animate-fade"
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
                <p className="text-text-secondary text-sm mt-2">This procedure will permanently delete the selected image or video from the visual asset library. This cannot be undone.</p>
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
                <div className="w-full rounded-[32px] overflow-hidden border border-border-subtle bg-bg-subtle aspect-video md:aspect-auto flex justify-center">
                    {isVideoFile(viewModal.img.image) ? (
                        <video 
                            src={getImageUrl(viewModal.img.image, apiBase)} 
                            className="w-full h-auto object-contain max-h-[70vh]" 
                            controls
                            autoPlay
                        />
                    ) : (
                        <img 
                            src={getImageUrl(viewModal.img.image, apiBase)} 
                            className="w-full h-auto object-contain max-h-[70vh]" 
                            alt="inspection" 
                        />
                    )}
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

      {/* Upload Modal with Guidelines, Drag and Drop, and Staged Files Progress Queue */}
      <Modal
        isOpen={addModal}
        onClose={() => {
            if (!loading) {
                setAddModal(false);
                clearStagedFiles();
            }
        }}
        title="Asset Transmission Protocol"
        footer={
            <div className="flex gap-3">
                <Button variant="secondary" disabled={loading} onClick={() => {
                    setAddModal(false);
                    clearStagedFiles();
                }}>Cancel</Button>
                <Button disabled={loading || stagedFiles.filter(f => f.status === 'staged').length === 0} onClick={handleUpload}>
                    {loading ? 'Transmitting...' : 'Confirm Upload'}
                </Button>
            </div>
        }
      >
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1 no-scrollbar text-white">
            {/* Guidelines Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bg-subtle border border-border-subtle p-5 rounded-[24px]">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-wider">Formats & Size Constraints</p>
                    <ul className="text-[11px] text-text-secondary space-y-1 font-medium">
                        <li>• <strong className="text-text-primary">Images:</strong> JPG, JPEG, PNG, WEBP (Max <strong className="text-text-primary">5 MB</strong>)</li>
                        <li>• <strong className="text-text-primary">Videos:</strong> MP4, MOV, WEBM (Max <strong className="text-text-primary">50 MB</strong>)</li>
                        <li>• <strong className="text-text-primary">Recommended Images:</strong> 1920x1080px (16:9 ratio)</li>
                        <li>• <strong className="text-text-primary">Recommended Videos:</strong> 1080p, H.264 compression</li>
                    </ul>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider">Compliance Protocol</p>
                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                        <p className="text-[10px] text-amber-600 leading-relaxed font-bold">
                            WARNING: Only upload owned or authorized assets. All files undergo backend inspection. Files violating dimensions, size limits, or format restrictions will be immediately rejected and expunged.
                        </p>
                    </div>
                </div>
            </div>

            {/* Drag and Drop Upload Area */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Asset Intake Area</label>
                <div 
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (!loading) setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (!loading && e.dataTransfer.files) {
                            handleFilesAdded(e.dataTransfer.files);
                        }
                    }}
                    className={`relative w-full h-36 flex flex-col items-center justify-center gap-3 bg-bg-subtle border-2 border-dashed rounded-[24px] cursor-pointer transition-all duration-300 group ${
                        isDragging 
                            ? 'border-primary bg-primary/5 scale-[1.01] shadow-[0_0_20px_rgba(46,125,125,0.15)]' 
                            : 'border-border-subtle hover:border-border-primary-subtle hover:bg-primary/5'
                    }`}
                >
                    <input 
                        type="file" 
                        multiple 
                        id="gallery-upload"
                        className="hidden" 
                        disabled={loading}
                        onChange={e => {
                            if (e.target.files) {
                                handleFilesAdded(e.target.files);
                            }
                        }}
                    />
                    <label htmlFor="gallery-upload" className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer">
                        <div className="p-3 bg-bg-primary-subtle rounded-full text-primary group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                        </div>
                        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest text-center px-4">
                            Drag & Drop visuals here or <span className="text-primary hover:underline">browse files</span>
                        </p>
                    </label>
                </div>
            </div>

            {/* Staged Files List Queue */}
            {stagedFiles.length > 0 && (
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Staged Assets Queue ({stagedFiles.length})</p>
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                        {stagedFiles.map((staged) => {
                            const formattedSize = (staged.size / (1024 * 1024)).toFixed(2) + ' MB';
                            const isImage = staged.file.type.startsWith('image/');
                            const isVideo = staged.file.type.startsWith('video/');
                            
                            return (
                                <div 
                                    key={staged.id}
                                    className="p-3.5 bg-bg-subtle border border-border-subtle rounded-2xl flex items-center justify-between gap-4 relative overflow-hidden group/item"
                                >
                                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                        {/* Preview Thumbnail */}
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-border-subtle shrink-0 bg-black flex items-center justify-center relative">
                                            {isImage && staged.previewUrl ? (
                                                <img src={staged.previewUrl} alt="" className="w-full h-full object-cover" />
                                            ) : isVideo && staged.previewUrl ? (
                                                <video src={staged.previewUrl} className="w-full h-full object-cover" muted />
                                            ) : (
                                                <ImageIcon size={20} className="text-text-secondary" />
                                            )}
                                        </div>
                                        
                                        {/* File Metadata */}
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <p className="text-xs font-bold text-text-primary truncate">{staged.name}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                                                <span>{formattedSize}</span>
                                                <span>•</span>
                                                <span className="truncate">{staged.file.type || 'unknown'}</span>
                                            </div>
                                            
                                            {/* Progress Bar or Validation Error message */}
                                            {staged.status === 'uploading' && (
                                                <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden mt-2">
                                                    <div 
                                                        className="bg-primary h-full transition-all duration-300"
                                                        style={{ width: `${staged.progress}%` }}
                                                    />
                                                </div>
                                            )}
                                            {staged.status === 'error' && (
                                                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide mt-1">{staged.errorMsg}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons & States */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {staged.status === 'uploading' && (
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{staged.progress}%</span>
                                        )}
                                        {staged.status === 'success' && (
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                                                <Check size={12} className="stroke-[3]" />
                                            </div>
                                        )}
                                        {staged.status === 'error' && (
                                            <div className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
                                                <X size={12} className="stroke-[3]" />
                                            </div>
                                        )}
                                        {staged.status !== 'uploading' && staged.status !== 'success' && (
                                            <button 
                                                onClick={() => removeStagedFile(staged.id)}
                                                disabled={loading}
                                                className="p-1.5 hover:bg-rose-500/10 text-text-secondary hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                                                title="Remove"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
      </Modal>
    </div>
  );
};

export default GalleryManager;
