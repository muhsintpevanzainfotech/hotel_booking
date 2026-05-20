import React from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({ value, onChange, options, label, className, variant = 'default' }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={twMerge('relative space-y-2', className)} ref={containerRef}>
      {label && <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "w-full bg-bg-subtle border border-border-subtle flex items-center justify-between cursor-pointer transition-all hover:border-border-primary-subtle",
          variant === 'small' ? "rounded-lg px-2 py-1.5" : "rounded-xl px-4 py-3",
          isOpen && "border-primary ring-2 ring-primary/10 bg-card-luxury"
        )}
      >
        <span className={twMerge(
          "font-medium text-text-primary",
          variant === 'small' ? "text-[10px]" : "text-[13px]"
        )}>{selectedOption?.label}</span>
        <ChevronDown size={variant === 'small' ? 12 : 16} className={twMerge("text-primary transition-transform duration-300", isOpen && "rotate-180")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 right-0 top-full mt-2 z-[110] bg-card-luxury border border-border-subtle rounded-xl shadow-2xl overflow-hidden py-1"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={twMerge(
                  "px-4 py-2.5 font-medium transition-all flex items-center justify-between cursor-pointer group",
                  variant === 'small' ? "text-[11px] py-1.5" : "text-[13px] py-2.5",
                  value === option.value 
                    ? "bg-primary text-white" 
                    : "text-text-secondary hover:bg-bg-subtle hover:text-white"
                )}
              >
                {option.label}
                {value === option.value && <Check size={variant === 'small' ? 10 : 14} className="text-white" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Button = ({ children, className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] shadow-lg shadow-primary/20',
    secondary: 'bg-bg-subtle text-text-secondary border border-border-subtle hover:bg-bg-subtle hover:text-white',
    ghost: 'hover:bg-bg-subtle text-text-secondary hover:text-white transition-all',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white',
  };

  return (
    <button 
      className={twMerge(
        'px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, status = 'default', className }) => {
  const styles = {
    default: 'bg-bg-subtle text-text-secondary border border-border-subtle',
    success: 'bg-bg-primary-subtle text-primary border border-border-primary-subtle',
    warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
    info: 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20',
  };

  return (
    <span className={twMerge(
      'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border inline-flex items-center gap-1.5',
      styles[status] || styles.default,
      className
    )}>
      {children}
    </span>
  );
};

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card-luxury border border-border-subtle rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-border-subtle flex justify-between items-center bg-bg-subtle">
              <div>
                <h3 className="text-[18px] font-bold text-text-primary tracking-tight">{title}</h3>
                <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] mt-1 italic">Intelligence Protocol Active</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-bg-subtle border border-border-subtle flex items-center justify-center text-text-secondary hover:text-white transition-all hover:rotate-90"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {children}
            </div>

            {footer && (
              <div className="p-6 bg-bg-subtle border-t border-border-subtle flex justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Switch = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      {label && <span className="text-[13px] font-medium text-text-primary tracking-tight">{label}</span>}
      <button
        onClick={() => onChange(!checked)}
        className={twMerge(
          "relative w-11 h-6 rounded-full transition-colors duration-200 outline-none",
          checked ? "bg-primary" : "bg-bg-subtle"
        )}
      >
        <motion.div
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );
};
