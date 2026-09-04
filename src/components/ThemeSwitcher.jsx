import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { useSound } from './SoundEngine';

const ThemeSwitcher = () => {
  const { theme, setTheme, activeThemeConfig, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sound = useSound();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (themeId) => {
    setTheme(themeId);
    setIsOpen(false);
    if (sound && sound.playClick) sound.playClick();
  };

  return (
    <div className="relative font-mono" ref={dropdownRef}>
      {/* Trigger Pill */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (sound && sound.playHover) sound.playHover();
        }}
        className="haptic-ripple flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/90 border border-outline-variant hover:border-cyber-cyan text-xs text-on-surface transition-all duration-300 hover:shadow-[0_0_15px_-3px_rgba(0,242,254,0.3)] group"
        title="Switch Cyber Theme Protocol"
        aria-label="Switch Cyber Theme Protocol"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] transition-colors duration-300"
          style={{ backgroundColor: activeThemeConfig.colorHex, color: activeThemeConfig.colorHex }}
        ></span>
        <span className="text-[11px] font-medium tracking-wide hidden sm:inline text-on-surface group-hover:text-cyber-cyan transition-colors">
          {activeThemeConfig.name}
        </span>
        <span className="material-symbols-outlined text-[14px] text-on-surface-variant transition-transform duration-300 group-hover:text-cyber-cyan" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
          expand_more
        </span>
      </button>

      {/* Glassmorphic Cyber Protocol Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl border border-white/10 shadow-2xl z-[100] backdrop-blur-2xl"
            style={{
              background: 'rgba(9, 13, 22, 0.92)',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.8), 0 0 0 1px rgb(var(--cyber-cyan-rgb) / 0.2)',
            }}
          >
            <div className="px-3 py-1.5 border-b border-outline-variant/60 flex items-center justify-between text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
              <span>{"// SYSTEM_PROTOCOL"}</span>
              <span className="text-cyber-cyan">4 AVAILABLE</span>
            </div>

            <div className="flex flex-col gap-1">
              {themes.map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelect(t.id)}
                    className={`haptic-ripple w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between transition-all duration-200 group ${
                      isActive
                        ? 'bg-surface-container-highest border border-cyber-cyan/40 text-white'
                        : 'hover:bg-surface-container border border-transparent text-on-surface-variant hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-125"
                        style={{
                          backgroundColor: t.colorHex,
                          boxShadow: `0 0 10px ${t.colorHex}`,
                        }}
                      >
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-surface-dim"></div>}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                          {t.name}
                        </span>
                        <span className="text-[9px] text-on-surface-variant/80 font-sans tracking-tight">
                          {t.subtitle}
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <span className="material-symbols-outlined text-[16px] text-cyber-cyan animate-pulse">
                        check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
