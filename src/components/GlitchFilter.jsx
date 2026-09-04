import React from 'react';

/**
 * GlitchFilter
 * Renders an SVG displacement filter using feTurbulence and feDisplacementMap.
 * Elements with `filter: url(#cyber-glitch-filter)` will render hardware-accelerated
 * cybernetic digital signal distortion.
 */
const GlitchFilter = () => {
  return (
    <svg
      className="absolute -left-[9999px] -top-[9999px] w-0 h-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        <filter id="cyber-glitch-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.95"
            numOctaves="1"
            result="warp"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="18"
            in="SourceGraphic"
            in2="warp"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default GlitchFilter;
