import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

const XRayCard = ({ children, className, style }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative ${className || ""}`}
      style={style}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-50"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 242, 254, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
};

export default XRayCard;
