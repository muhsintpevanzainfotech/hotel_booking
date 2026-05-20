import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { updateProfileSuccess } from '../../redux/slices/authSlice';
import { Sparkles, Phone, MessageSquare, Mail, Map, Save, MessageCircle, Image, Send, Globe, Link2 } from 'lucide-react';
import { Switch } from '../common/UIComponents';
import toast from 'react-hot-toast';
import LoadingScreen from './LoadingScreen';

export const SiteSettings = ({ apiBase }) => {
    const { user, token } = useSelector(state => state.auth);
    const { isDarkMode } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    const [notifs, setNotifs] = useState(user?.notificationsEnabled ?? true);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggleNotifs = async (val) => {
        setNotifs(val);
        try {
            setIsUpdating(true);
            const res = await fetch(`${apiBase}/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationsEnabled: val })
            });
            if (res.ok) {
                dispatch(updateProfileSuccess({ notificationsEnabled: val }));
                toast.success(`Notifications ${val ? 'Enabled' : 'Disabled'}`);
            } else {
                toast.error('Failed to update preferences');
                setNotifs(!val);
            }
        } catch (err) {
            toast.error('Network sync failure');
            setNotifs(!val);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Terminal Settings</h2>
                    <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.3em] mt-1">Global & Personal Configuration</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-[14px] font-black text-text-primary uppercase tracking-widest border-l-4 border-primary pl-4">Personal Profile</h3>
                    <div className="glass-card p-6 space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-16 h-16 rounded-2xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center font-bold text-primary text-2xl">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-[18px] font-bold text-text-primary tracking-tight">{user?.username}</p>
                                <p className="text-[12px] text-text-secondary uppercase tracking-widest font-semibold">{user?.role?.replace('_', ' ')}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border-subtle">
                            <div className="p-4 rounded-xl bg-bg-subtle border border-border-subtle">
                                <Switch 
                                    label="System Notifications" 
                                    checked={notifs} 
                                    onChange={handleToggleNotifs} 
                                />
                                <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">Receive real-time alerts for new enquiries, bookings, and system events.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-bg-subtle border border-border-subtle">
                                <Switch 
                                    label="Light Mode" 
                                    checked={!isDarkMode} 
                                    onChange={() => dispatch(toggleTheme())} 
                                />
                                <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">Switch between dark luxury and crisp light aesthetic.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Email Intelligence</label>
                                <input 
                                    type="text" 
                                    value={user?.email || ''} 
                                    disabled
                                    className="w-full bg-bg-subtle border border-border-subtle rounded-xl py-3 px-4 text-sm text-slate-500 outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {user?.role === 'super_admin' && (
                    <div className="space-y-4">
                        <h3 className="text-[14px] font-black text-text-primary uppercase tracking-widest border-l-4 border-primary pl-4">Global Terminal Control</h3>
                        <div className="glass-card p-6 space-y-6">
                            <div className="p-6 bg-primary/5 rounded-2xl border border-border-primary-subtle">
                                <p className="text-text-secondary text-[11px] font-semibold mb-4 uppercase tracking-widest leading-relaxed">
                                    Administrative synchronization will update the public website configuration across all distributed nodes.
                                </p>
                                <button className="w-full h-[48px] px-6 bg-primary text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                    <Sparkles size={16} /> Commit Global Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const SocialManager = ({ apiBase }) => {
  const [data, setData] = useState({ 
    phone: '', whatsapp: '', email: '', address: '', mapLink: '',
    socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '' } 
  });
  const [loading, setLoading] = useState(true);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const res = await fetch(`${apiBase}/contact`);
        const json = await res.json();
        if (json) setData(prev => ({ ...prev, ...json }));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSocial();
  }, [apiBase]);

  const handleSave = async () => {
    try {
      const res = await fetch(`${apiBase}/contact`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) toast.success('Global ecosystem synchronized');
      else toast.error('Update protocol failed');
    } catch (err) { toast.error('Network sync failure'); }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="w-full space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Social Ecosystem</h2>
          <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.3em] mt-1">Unified Brand & Communication Terminal</p>
        </div>
        <button onClick={handleSave} className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
          <Save size={16} /> Sync Ecosystem
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
            <h3 className="text-[14px] font-black text-text-primary uppercase tracking-widest border-l-4 border-primary pl-4">Brand Resonance Nodes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                { key: 'facebook', icon: MessageCircle, label: 'Facebook', color: 'text-blue-500' },
                { key: 'instagram', icon: Image, label: 'Instagram', color: 'text-pink-500' },
                { key: 'twitter', icon: Send, label: 'X (Twitter)', color: 'text-slate-200' },
                { key: 'linkedin', icon: Globe, label: 'LinkedIn', color: 'text-blue-400' },
                ].map((item) => (
                <div key={item.key} className="glass-card p-5 group hover:border-border-primary-subtle transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl bg-bg-subtle border border-border-subtle ${item.color} group-hover:scale-110 transition-transform`}>
                            <item.icon size={18} />
                        </div>
                        <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider">{item.label}</span>
                    </div>
                    <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
                        <input 
                            type="text" 
                            value={data.socialLinks?.[item.key] || ''} 
                            onChange={e => setData({
                            ...data, 
                            socialLinks: { ...data.socialLinks, [item.key]: e.target.value }
                            })}
                            placeholder="URL..."
                            className="w-full bg-bg-subtle border border-border-subtle rounded-xl py-3 pl-10 pr-4 text-[12px] text-text-primary outline-none focus:border-border-primary-subtle transition-all"
                        />
                    </div>
                </div>
                ))}
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-[14px] font-black text-text-primary uppercase tracking-widest border-l-4 border-primary pl-4">Communication Infrastructure</h3>
            <div className="glass-card p-5 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Direct Line</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                            <input 
                                type="text" 
                                value={data.phone} 
                                onChange={e => setData({...data, phone: e.target.value})}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-bg-subtle border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">WhatsApp Channel</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                            <input 
                                type="text" 
                                value={data.whatsapp} 
                                onChange={e => setData({...data, whatsapp: e.target.value})}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-bg-subtle border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Secure Support Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                        <input 
                            type="email" 
                            value={data.email} 
                            onChange={e => setData({...data, email: e.target.value})}
                            placeholder="support@lakeview.com"
                            className="w-full bg-bg-subtle border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Estate Presence (Address)</label>
                        <textarea 
                            value={data.address} 
                            onChange={e => setData({...data, address: e.target.value})}
                            placeholder="Physical address..."
                            rows={3}
                            className="w-full bg-bg-subtle border border-border-subtle rounded-xl p-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all resize-none"
                        />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Geospatial Marker (Map Link)</label>
                        <div className="relative flex-1">
                            <Map className="absolute left-4 top-4 text-text-secondary" size={16} />
                            <textarea 
                                value={data.mapLink} 
                                onChange={e => setData({...data, mapLink: e.target.value})}
                                placeholder="Google Maps URL..."
                                rows={3}
                                className="w-full h-full bg-bg-subtle border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-border-primary-subtle transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
