'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = 'hidden';

    let currentProgress = 0;
    const duration = 3000; // 3.5 seconds
    const intervalTime = 20; // Update every 20ms
    const step = 100 / (duration / intervalTime);

    // Custom easing function for more organic feel (easeOutExpo)
    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      // Apply easing to progress
      const easedProgress = Math.floor(easeOutExpo(t) * 100);
      
      setProgress(easedProgress);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = '';
        }, 500); // Wait a half second at 100% before fading out
      }
    };

    requestAnimationFrame(animate);

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
        >
          {/* Main Counter */}
          <div className="relative flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-8xl md:text-[12rem] font-bold leading-none tracking-tighter"
              style={{ fontFamily: 'var(--font-museo)' }}
            >
              {progress}
              <span className="text-4xl md:text-6xl text-primary align-top">%</span>
            </motion.div>
            
            {/* Branding / Text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 uppercase tracking-[0.3em] text-sm md:text-base text-gray-400 font-medium"
            >
              GITB!
            </motion.div>
          </div>

          {/* Progress Bar at bottom */}
          <div className="absolute bottom-10 left-1/2 w-[80%] max-w-md -translate-x-1/2 h-[2px] bg-white/20 overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
