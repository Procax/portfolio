import React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

/**
 * XRayCard
 * Combines radial cursor spotlight with physical 3D multi-layer parallax tilt.
 * Internal elements styled with `transform-3d` and `translate-z-[n]` will float
 * holographically above the card surface when hovering.
 */
const XRayCard = ({ children, className = "", style = {} }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth 3D tilt springs
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 22 });

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;

    mouseX.set(x);
    mouseY.set(y);

    // Calculate 3D tilt angles (-8deg to +8deg)
    const xPct = x / width - 0.5;
    const yPct = y / height - 0.5;
    rawRotateX.set(-yPct * 14);
    rawRotateY.set(xPct * 14);
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: 1200, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full transition-shadow duration-300"
      >
        {/* Radial X-Ray Spotlight Overlay */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-40"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                450px circle at ${mouseX}px ${mouseY}px,
                rgb(var(--cyber-cyan-rgb) / 0.18),
                transparent 80%
              )
            `,
            transform: "translateZ(1px)",
          }}
        />

        {children}
      </motion.div>
    </div>
  );
};

export default XRayCard;
