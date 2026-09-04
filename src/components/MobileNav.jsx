import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { id: 'home',    label: 'Home',    icon: 'terminal',    href: '#home'    },
  { id: 'about',   label: 'About',   icon: 'person',      href: '#about'   },
  { id: 'skills',  label: 'Skills',  icon: 'code',        href: '#skills'  },
  { id: 'work',    label: 'Work',    icon: 'folder_open', href: '#work'    },
  { id: 'contact', label: 'Contact', icon: 'mail',        href: '#contact' },
];

const MobileNav = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [visible, setVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  // Track active section
  useEffect(() => {
    const sectionEls = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the section with the highest intersection ratio
        let best = null;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            best = entry.target.id;
          }
        });
        if (best) setActiveSection(best);
      },
      {
        threshold: [0.1, 0.25, 0.5],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => sectionEls.forEach((el) => observer.unobserve(el));
  }, []);

  // Show on scroll up, hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 60) {
        setVisible(true);
      } else {
        setVisible(currentY < lastScrollY.current);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="mobile-nav"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          // safe-area-inset-bottom handles iPhone notch / home indicator
          className="fixed left-0 right-0 bottom-0 z-[999] md:hidden flex justify-center"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
          aria-label="Mobile Navigation"
        >
          {/* Glassmorphic dock */}
          <div
            className="flex items-center gap-0.5 px-2 py-2 mx-4 rounded-2xl border border-white/10"
            style={{
              background: 'rgba(9, 13, 22, 0.82)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              boxShadow:
                '0 -4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,242,254,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleClick(item.href)}
                  whileTap={{ scale: 0.85 }}
                  className={`haptic-ripple relative flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl transition-colors duration-300 flex-1 min-w-0 ${
                    isActive ? 'text-cyber-cyan' : 'text-on-surface-variant'
                  }`}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Sliding active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'rgba(0,242,254,0.10)',
                        boxShadow: '0 0 14px rgba(0,242,254,0.18)',
                      }}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}

                  {/* Material Symbol Icon */}
                  <span
                    className="material-symbols-outlined relative z-10 transition-all duration-300"
                    style={{
                      fontSize: isActive ? '22px' : '20px',
                      filter: isActive
                        ? 'drop-shadow(0 0 5px rgba(0,242,254,0.9))'
                        : 'none',
                    }}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span
                    className={`relative z-10 font-mono leading-none transition-all duration-300 ${
                      isActive
                        ? 'text-[9px] font-bold tracking-widest opacity-100'
                        : 'text-[8px] tracking-wider opacity-50'
                    }`}
                  >
                    {item.label.toUpperCase()}
                  </span>

                  {/* Active glow dot */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-1 block w-1 h-1 rounded-full bg-cyber-cyan"
                      style={{ boxShadow: '0 0 8px rgba(0,242,254,1)' }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
