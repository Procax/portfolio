import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * SlotCounter
 * Rapidly scrambles through numeric characters like a cryptographic airport/terminal board
 * when entering the viewport, then securely resolves to the target value.
 */
const SlotCounter = ({ value, duration = 800, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [displayValue, setDisplayValue] = useState(value);
  const chars = "0123456789";

  useEffect(() => {
    if (!isInView) return;

    const targetStr = String(value);
    const length = targetStr.length;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // How many characters have locked in
      const lockedCharsCount = Math.floor(progress * length);

      let scrambled = "";
      for (let i = 0; i < length; i++) {
        const targetChar = targetStr[i];

        // Non-digits (symbols, letters, spaces) don't scramble
        if (!/\d/.test(targetChar)) {
          scrambled += targetChar;
        } else if (i < lockedCharsCount) {
          scrambled += targetChar;
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayValue(scrambled);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayValue(targetStr);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={`font-mono inline-block tracking-widest ${className}`}>
      {displayValue}
    </span>
  );
};

export default SlotCounter;

