import React from 'react';
import { motion } from 'framer-motion';

const Placeholder = ({ title, icon: Icon }) => (
    <div className="h-full flex flex-col items-center justify-center space-y-8 py-32">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-bg-primary-subtle p-10 rounded-[32px] border border-border-primary-subtle relative group"
        >
            <div className="absolute inset-0 bg-bg-primary-subtle blur-3xl rounded-full group-hover:bg-primary/30 transition-all" />
            <Icon size={80} className="text-primary relative z-10 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
        </motion.div>
        <div className="text-center relative z-10">
            <h3 className="text-2xl font-semibold text-text-primary uppercase tracking-tight">{title}</h3>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.4em] mt-4 max-w-sm mx-auto leading-loose">
                Module initializing • Secure neural synchronization in progress
            </p>
        </div>
    </div>
);

export default Placeholder;
