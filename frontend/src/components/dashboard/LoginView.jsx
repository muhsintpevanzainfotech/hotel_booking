import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, RefreshCw, Eye, EyeOff, ArrowLeft, Mail, ShieldCheck, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginView = ({ loginData, setLoginData, handleLogin, otpRequired, otp, setOtp, handleVerifyOtp, tempUser }) => {
  const { error, loading } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState('login'); // login, forgot, reset
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({ otp: '', newPassword: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Security code sent to email');
        setView('reset');
      } else {
        toast.error(data.message || 'Identity verification failed');
      }
    } catch (err) {
      toast.error('Network synchronization error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: resetData.otp, newPassword: resetData.newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Credentials updated. Terminal authorized.');
        setView('login');
      } else {
        toast.error(data.message || 'Verification sequence failed');
      }
    } catch (err) {
      toast.error('Security protocol interrupted');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0B1F1F] selection:bg-primary transition-colors p-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0F2929] p-8 md:p-12 rounded-[32px] shadow-2xl w-full max-w-[440px] border border-border-subtle relative overflow-hidden shadow-inner-glow"
      >
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-bg-primary-subtle blur-[100px] rounded-full" />
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-bg-primary-subtle p-4 rounded-2xl mb-6 border border-border-primary-subtle shadow-lg"
          >
            {view === 'login' && !otpRequired && <Lock size={32} className="text-primary" />}
            {view === 'login' && otpRequired && <ShieldCheck size={32} className="text-primary" />}
            {view === 'forgot' && <Mail size={32} className="text-primary" />}
            {view === 'reset' && <KeyRound size={32} className="text-primary" />}
          </motion.div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight uppercase text-center mb-[8px]">
            {view === 'forgot' ? 'Security Recovery' : view === 'reset' ? 'Password Reset' : 'Executive Access'}
          </h2>
          <p className="text-text-secondary font-semibold text-[10px] uppercase tracking-[0.3em] text-center">
            {view === 'forgot' ? 'Request Authorization Code' : view === 'reset' ? 'Set New Encrypted Token' : otpRequired ? 'Multi-Factor Verification' : 'Identity Verification Required'}
          </p>
        </div>

        <form 
            onSubmit={
                view === 'forgot' ? handleForgotSubmit : 
                view === 'reset' ? handleResetSubmit : 
                otpRequired ? handleVerifyOtp : 
                handleLogin
            } 
            className="space-y-[20px] relative z-10"
        >
          {error && view === 'login' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="p-4 bg-red-500/10 text-red-400 text-[11px] font-bold uppercase tracking-widest rounded-xl text-center border border-red-500/20"
            >
              {otpRequired ? 'Verification Error' : 'Access Denied'}: {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {view === 'login' && !otpRequired && (
              <motion.div 
                key="login-fields"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-[20px]"
              >
                <div className="space-y-[8px]">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">Clearance Identity</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Username or Email" 
                      className="w-full h-[52px] bg-black/40 px-5 rounded-xl outline-none border border-border-subtle focus:border-border-primary-subtle text-white transition-all text-sm placeholder:text-text-secondary"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Encrypted Token</label>
                      <button 
                          type="button" 
                          onClick={() => setView('forgot')}
                          className="text-[10px] text-primary hover:text-cyan-400 uppercase tracking-widest font-black transition-colors"
                      >
                          First Time / Forgot?
                      </button>
                  </div>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••••••" 
                      className={`w-full h-[52px] bg-black/40 px-5 pr-12 rounded-xl outline-none border border-border-subtle focus:border-border-primary-subtle text-white transition-all text-sm placeholder:text-text-secondary ${!showPassword ? 'tracking-[0.3em]' : ''}`}
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      autoComplete="current-password"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'login' && otpRequired && (
              <motion.div 
                key="otp-fields"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-[16px]"
              >
                <div className="p-4 bg-primary/5 border border-border-primary-subtle rounded-xl text-center space-y-1">
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">MFA Code Sent To</p>
                  <p className="text-[13px] text-primary font-bold">{tempUser?.email}</p>
                </div>
                <div className="space-y-[8px]">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">Verification Signal</label>
                  <input 
                    type="text" 
                    placeholder="Enter 6-Digit OTP" 
                    maxLength={6}
                    className="w-full h-[60px] bg-black/40 px-5 rounded-xl outline-none border border-border-primary-subtle text-white transition-all text-2xl text-center font-black tracking-[0.6em] placeholder:text-text-secondary placeholder:tracking-normal placeholder:text-sm"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </motion.div>
            )}

            {view === 'forgot' && (
              <motion.div 
                key="forgot-fields"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-[16px]"
              >
                <div className="space-y-[8px]">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">Recovery Destination (Email)</label>
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="w-full h-[52px] bg-black/40 px-5 rounded-xl outline-none border border-border-subtle focus:border-border-primary-subtle text-white transition-all text-sm"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
                <button 
                    type="button" 
                    onClick={() => setView('login')}
                    className="flex items-center justify-center gap-2 text-[10px] text-text-secondary hover:text-white uppercase tracking-widest font-bold w-full py-2 transition-all"
                >
                    <ArrowLeft size={12} /> Return to Terminal
                </button>
              </motion.div>
            )}

            {view === 'reset' && (
              <motion.div 
                key="reset-fields"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-[16px]"
              >
                <div className="space-y-[8px]">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">Authorization Code</label>
                    <input 
                        type="text" 
                        placeholder="6-Digit OTP" 
                        className="w-full h-[52px] bg-black/40 px-5 rounded-xl outline-none border border-border-subtle focus:border-border-primary-subtle text-white transition-all text-lg text-center font-black tracking-widest"
                        value={resetData.otp}
                        onChange={(e) => setResetData({...resetData, otp: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-[8px]">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">New Encrypted Token</label>
                    <input 
                        type="password" 
                        placeholder="Create New Password" 
                        className="w-full h-[52px] bg-black/40 px-5 rounded-xl outline-none border border-border-subtle focus:border-border-primary-subtle text-white transition-all text-sm"
                        value={resetData.newPassword}
                        onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                        required
                    />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            disabled={loading || isProcessing} 
            className="w-full h-[52px] bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_10px_20px_var(--bg-primary-subtle)] active:scale-[0.98] transition-all hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] disabled:opacity-50 overflow-hidden relative"
          >
            {(loading || isProcessing) ? (
              <div className="flex items-center justify-center gap-3">
                <RefreshCw className="animate-spin" size={18} />
                <span>Processing</span>
              </div>
            ) : (
                view === 'forgot' ? 'Request Clearance' : 
                view === 'reset' ? 'Finalize Identity' :
                otpRequired ? 'Authorize 2FA' : 
                'Initialize Access'
            )}
          </button>
        </form>
        
        <div className="mt-12 text-center pt-8 border-t border-border-subtle relative z-10 flex flex-col items-center gap-2">
          <p className="text-[9px] text-text-secondary font-bold uppercase tracking-[0.5em]">LAKEVIEW SECURE CORE v2.5</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">Systems Online</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;
