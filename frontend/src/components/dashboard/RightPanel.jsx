import React from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  Edit, 
  Upload, 
  Star, 
  Bell, 
  TrendingUp,
  ChevronRight,
  Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RightPanel = ({ apiBase }) => {
    const navigate = useNavigate();
    return (
    <div className="space-y-[24px]">
        {/* Priority Quick Actions */}
        <div className="glass-card card-padding">
            <h3 className="text-[18px] font-medium text-text-primary mb-[20px] border-l-[3px] border-primary pl-4 leading-none">Priority Actions</h3>
            <div className="grid grid-cols-2 gap-[12px]">
                {[
                    { icon: PlusCircle, label: 'Add Room', color: 'text-primary', tab: 'rooms' },
                    { icon: Edit, label: 'Create Blog', color: 'text-cyan-400', tab: 'blogs' },
                    { icon: Upload, label: 'Gallery', color: 'text-emerald-400', tab: 'gallery' },
                    { icon: Star, label: 'Testimonial', color: 'text-yellow-400', tab: 'testimonials' },
                    { icon: Bell, label: 'Messages', color: 'text-rose-400', tab: 'contact_messages' },
                    { icon: TrendingUp, label: 'Analytics', color: 'text-indigo-400', tab: 'dashboard' },
                ].map((action, i) => (
                    <button 
                        key={i} 
                        onClick={() => action.tab && navigate(`/${action.tab}`)}
                        className="flex flex-col items-center justify-center p-[16px] rounded-xl bg-bg-subtle border border-border-subtle hover:bg-card-luxury hover:border-border-primary-subtle transition-all hover:scale-[1.02] active:scale-[0.98] group h-[100px]"
                    >
                        <div className={`p-2 rounded-lg bg-bg-subtle mb-2 group-hover:scale-110 transition-transform ${action.color}`}>
                            <action.icon size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest text-center">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Recent Enquiries List */}
        <div className="glass-card card-padding">
            <div className="flex justify-between items-center mb-[12px]">
                <h3 className="text-[18px] font-medium text-text-primary border-l-[3px] border-primary pl-4 leading-none">Live Enquiries</h3>
                <span 
                  onClick={() => navigate('/enquiries')}
                  className="text-[12px] font-semibold text-primary uppercase tracking-widest cursor-pointer hover:underline"
                >
                  See All
                </span>
            </div>
            <div className="space-y-[16px]">
                {[
                    { name: 'Marcus Aurelius', time: '12 min ago', subject: 'Royal Suite Inquiry' },
                    { name: 'Diana Prince', time: '45 min ago', subject: 'Wedding Package' },
                    { name: 'Bruce Wayne', time: '2 hours ago', subject: 'Penthouse Availability' },
                ].map((e, i) => (
                    <div 
                      key={i} 
                      onClick={() => navigate('/enquiries')}
                      className="p-[16px] rounded-xl bg-bg-subtle border border-border-subtle flex items-center justify-between group cursor-pointer hover:bg-card-luxury transition-all"
                    >
                        <div className="flex items-center gap-[12px]">
                            <div className="w-[40px] h-[40px] rounded-xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center font-bold text-primary text-sm">
                                {e.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[14px] font-semibold text-text-primary tracking-tight">{e.name}</p>
                                <p className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">{e.subject}</p>
                            </div>
                        </div>
                        <ChevronRight size={14} className="text-text-secondary group-hover:text-primary transition-colors" />
                    </div>
                ))}
            </div>
        </div>

        {/* Room Availability Progress */}
        <div className="glass-card card-padding">
            <h3 className="text-[18px] font-medium text-text-primary mb-[12px] border-l-[3px] border-primary pl-4 leading-none">Occupancy Yield</h3>
            <div className="space-y-[16px]">
                {[
                    { type: 'Royal Suites', value: 85, color: 'bg-primary' },
                    { type: 'Deluxe Rooms', value: 62, color: 'bg-cyan-500' },
                    { type: 'Executive Wing', value: 45, color: 'bg-emerald-500' },
                ].map((r, i) => (
                    <div key={i} className="space-y-[8px]">
                        <div className="flex justify-between items-end">
                            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-widest">{r.type}</span>
                            <span className="text-[13px] font-bold text-text-primary">{r.value}%</span>
                        </div>
                        <div className="h-[6px] w-full bg-bg-subtle rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${r.value}%` }}
                                transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                                className={`h-full ${r.color} shadow-[0_0_8px_var(--primary)]`} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
};

export default RightPanel;
