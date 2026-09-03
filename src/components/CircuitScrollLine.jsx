import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CircuitScrollLine = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="fixed top-0 left-4 md:left-12 bottom-0 w-8 z-0 pointer-events-none opacity-40">
      <svg width="100%" height="100%" viewBox="0 0 20 1000" preserveAspectRatio="none">
        <motion.path
          d="M 10,0 L 10,200 L 0,210 L 0,300 L 20,320 L 20,600 L 10,610 L 10,1000"
          fill="none"
          stroke="#00f2fe"
          strokeWidth="2"
          style={{ pathLength }}
          className="glow-cyan"
        />
        <motion.circle
          cx="10"
          cy="10"
          r="4"
          fill="#00f2fe"
          style={{ scale: useTransform(scrollYProgress, [0, 0.05], [0, 1]) }}
        />
        <motion.circle
          cx="10"
          cy="990"
          r="4"
          fill="#00f2fe"
          style={{ scale: useTransform(scrollYProgress, [0.95, 1], [0, 1]) }}
        />
      </svg>
    </div>
  );
};

export default CircuitScrollLine;
