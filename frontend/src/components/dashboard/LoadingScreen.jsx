import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingScreen = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-[#0B1F1F]">
    <div className="relative">
        <RefreshCw className="animate-spin text-primary" size={64} strokeWidth={3} />
        <div className="absolute inset-0 blur-2xl bg-bg-primary-subtle animate-pulse" />
    </div>
    <p className="mt-8 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.4em]">Initializing Neural Dashboard...</p>
  </div>
);

export default LoadingScreen;
