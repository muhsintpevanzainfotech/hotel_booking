import React from 'react';
import { motion } from 'framer-motion';

const PageHero = ({ title, subtitle, image }) => (
  <section className="page-hero" style={{ backgroundImage: `url(${image})` }}>
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center animate-ken-burns" style={{ backgroundImage: `url(${image})` }}></div>
    </div>
    <div className="page-hero-content pt-40">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <span className="section-tag flex items-center gap-4">
           <span className="w-12 h-[1px] bg-primary"></span>
           The Collection
        </span>
        <h1 className="text-white leading-tight font-light">
          {title} <br/> 
          <span className="text-primary italic font-normal">{subtitle}</span>
        </h1>
      </motion.div>
    </div>
  </section>
);

export default PageHero;
