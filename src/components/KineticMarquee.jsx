import React, { useRef } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring, useAnimationFrame, useMotionValue } from 'framer-motion';

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const KineticMarquee = ({ text, baseVelocity = 5 }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap fixed inset-0 z-0 pointer-events-none opacity-[0.03] flex-col justify-center mix-blend-screen">
      <motion.div className="flex font-display font-black text-[12vw] leading-none uppercase tracking-tighter text-cyber-cyan" style={{ x }}>
        <span className="block mr-16">{text} </span>
        <span className="block mr-16">{text} </span>
        <span className="block mr-16">{text} </span>
        <span className="block mr-16">{text} </span>
      </motion.div>
    </div>
  );
};

export default KineticMarquee;
