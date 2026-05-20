import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Initial scroll lock
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Re-enable scroll after preloader finishes
      setTimeout(() => {
        document.body.style.overflow = 'unset';
        if (onFinish) onFinish();
      }, 1200); // Wait for exit animation
    }, 3500); // Slightly longer for 3D experience

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="preloader-container"
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { 
              duration: 1.2, 
              ease: [0.76, 0, 0.24, 1],
              delay: 0.2
            }
          }}
        >
          <div className="preloader-content">
            <motion.div 
              className="preloader-logo-wrapper"
              initial={{ scale: 0.5, opacity: 0, rotateX: 45 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="logo-3d-ring"></div>
              <div className="logo-3d-ring" style={{ animationDelay: '-5s', width: '260px', height: '260px', opacity: 0.5 }}></div>
              <img src="/favicon.png" alt="Lake Breeze" className="preloader-logo" />
              <div className="logo-glow"></div>
            </motion.div>
            
            <div className="preloader-text-container">

              
              <motion.div 
                className="preloader-text-reveal"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src="/lakebreeze.png" alt="Lake Breeze Resort" className="preloader-brand-img" />
              </motion.div>

              <div className="loading-bar-wrapper">
                <motion.div 
                  className="loading-bar-progress"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
          
          <motion.div 
            className="preloader-bg-accent"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
