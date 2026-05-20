import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, isUp }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass-card card-padding flex items-center gap-[12px] cursor-pointer"
  >
    <div className="w-[40px] h-[40px] rounded-xl bg-bg-primary-subtle border border-border-primary-subtle flex items-center justify-center text-primary shrink-0">
        <Icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
        <p className="text-[12px] font-normal text-text-secondary uppercase tracking-widest truncate">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-[20px] font-semibold text-text-primary tracking-tight">{value}</h4>
            {trend && (
                <span className={`text-[10px] font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isUp ? '↑' : '↓'}{trend}%
                </span>
            )}
        </div>
    </div>
  </motion.div>
);

export default StatCard;
