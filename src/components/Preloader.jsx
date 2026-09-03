import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootSequence = [

    "INITIALIZING KINETIC_SYS V.4.2...",
    "LOADING USER_PROFILE: KARANSINGH_HAJARI",
    "CONNECTING TO NEURAL_NET...",
    "MOUNTING CYBER_UI MODULES...",
    "ESTABLISHING COMMS_LINK...",
    "ALL SYSTEMS NOMINAL. READY."
];

const Preloader = ({ onComplete }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLines(prev => [...prev, bootSequence[index]]);
      index++;
      if (index === bootSequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500); // short delay before hiding
      }
    }, 200); // fast typing effect
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-start justify-end p-8 bg-[#090d16] font-mono text-xs sm:text-sm text-cyber-cyan tracking-widest pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="w-full max-w-3xl">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-2 flex items-center gap-3"
            >
              <span className="text-on-surface-variant">[{new Date().toISOString().split('T')[1].slice(0, -1)}]</span>
              <span>{line}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-3 h-4 bg-cyber-cyan mt-2"
        />
      </div>
    </motion.div>
  );
};

export default Preloader;
