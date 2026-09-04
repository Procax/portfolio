import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { useSound } from './SoundEngine';
import SlotCounter from './SlotCounter';

// The 6 Core Engineering Disciplines
const DISCIPLINES = [
  {
    id: 'architecture',
    name: 'Component Architecture',
    short: 'Architecture',
    score: 95,
    tagline: 'Modular, decoupled, and scalable React systems',
    description:
      'Engineered with atomic component hierarchy, clean separation of concerns, and robust prop interfaces. Logic is systematically decoupled into reusable custom hooks, ensuring zero prop-drilling and high extensibility.',
    highlights: ['Atomic Design', 'Custom Hook Extraction', 'Container/Presentational Pattern', 'Zero Prop-Drilling'],
    stack: ['React 18+', 'Custom Hooks', 'Context API', 'TypeScript-ready patterns'],
    provenIn: [
      { label: 'YouTube Clone', href: '#work' },
      { label: 'Pokédex SPA', href: '#work' },
      { label: 'World Telemetry Engine', href: '#telemetry' },
    ],
  },
  {
    id: 'visual-polish',
    name: 'Visual Polish & Micro-Interactions',
    short: 'Visual Polish',
    score: 98,
    tagline: 'Physics-based springs, 3D tilt & cyber shaders',
    description:
      'Elevating standard UI into memorable tactile experiences. Implements mouse-spring parallax tilting, SVG hardware displacement glitches, tactile Web Audio synthesis, and GPU-accelerated canvas particle physics.',
    highlights: ['3D Spring Physics', 'SVG Displacement Filters', 'Procedural Audio Synthesis', 'Canvas Particle Engines'],
    stack: ['Tailwind CSS', 'Framer Motion', 'Canvas 2D / Three.js', 'Web Audio API'],
    provenIn: [
      { label: '3D Holographic Parallax', href: '#work' },
      { label: 'Cyber Theme Switcher', href: '#home' },
      { label: '3D Telemetry Radar', href: '#telemetry' },
    ],
  },
  {
    id: 'performance',
    name: 'Web Performance & Web Vitals',
    short: 'Performance',
    score: 92,
    tagline: 'Sub-50ms interaction budgets & 60 FPS animation loops',
    description:
      'Relentless focus on smooth frame budgets. Code-splitting with dynamic imports, zero cumulative layout shift (CLS: 0), minimal DOM reflows, and lightweight mathematical canvas loops over heavy third-party bundles.',
    highlights: ['60 FPS Frame Budget', 'Zero Layout Shift (CLS: 0)', 'requestAnimationFrame loops', 'Memory Leak Safeguards'],
    stack: ['Lighthouse 100s', 'Web Vitals', 'Tree-shaking', 'Native Browser APIs'],
    provenIn: [
      { label: '260-Node 3D Globe', href: '#telemetry' },
      { label: 'Cursor Trail Canvas', href: '#home' },
      { label: 'Kinetic Marquee', href: '#home' },
    ],
  },
  {
    id: 'responsive',
    name: 'Responsive Design & Mobile-First',
    short: 'Responsive UI',
    score: 96,
    tagline: 'Fluid layouts from 320px mobile to 4K ultra-wide',
    description:
      'Crafted with mobile-first CSS architecture, dynamic clamp() typography, responsive CSS Grid bento modules, touch-friendly hit areas (min 44px), and hardware-safe area insets for modern mobile viewports.',
    highlights: ['Mobile Glass Dock', 'Fluid Typography', 'Hardware Safe-Area Insets', 'Touch Gesture Handling'],
    stack: ['Tailwind Grid & Flexbox', 'CSS Clamp / Media Queries', 'Mobile Navigation Dock'],
    provenIn: [
      { label: 'MobileNav Dock', href: '#home' },
      { label: 'Adaptive Bento Grids', href: '#skills' },
      { label: 'Responsive Terminal Deck', href: '#telemetry' },
    ],
  },
  {
    id: 'state-async',
    name: 'State Management & Async APIs',
    short: 'State & Async',
    score: 90,
    tagline: 'Predictable unidirectional state & reliable data pipelines',
    description:
      'Structured asynchronous data fetching with optimistic UI updates, robust error boundaries, graceful retry fallbacks, and real-time state synchronization with localStorage persistence.',
    highlights: ['Unidirectional Data Flow', 'Async Pipelines', 'Graceful Error Boundaries', 'Client-side Persistence'],
    stack: ['Redux Toolkit', 'Context API', 'EmailJS API', 'RESTful Fetch / PokeAPI'],
    provenIn: [
      { label: 'YouTube Search Feed', href: '#work' },
      { label: 'PokéAPI Archive', href: '#work' },
      { label: 'Terminal Email Dispatcher', href: '#contact' },
    ],
  },
  {
    id: 'clean-code',
    name: 'Clean Code & Git Workflow',
    short: 'Clean Code',
    score: 94,
    tagline: 'Strict CI zero-warning policy & semantic atomic commits',
    description:
      'Committed to production-ready hygiene: semantic git commit conventions, atomic branch workflows, self-documenting clean code, and zero ESLint warnings enforced under strict CI=true compilation.',
    highlights: ['CI=true Zero Warnings', 'Atomic Semantic Commits', 'ESLint / Prettier Standards', 'Automated Vercel CD'],
    stack: ['Git', 'GitHub', 'CI/CD Pipelines', 'ESLint'],
    provenIn: [
      { label: 'GitHub Repository', href: 'https://github.com/Procax/portfolio' },
      { label: 'Vercel Deployment', href: 'https://portfolio-eta-bay-42.vercel.app/' },
    ],
  },
];

// Helper to calculate radar chart points
const CX = 180;
const CY = 180;
const MAX_RADIUS = 125;
const NUM_AXES = DISCIPLINES.length;

function getCoordinates(index, ratio) {
  const angle = (Math.PI * 2 * index) / NUM_AXES - Math.PI / 2;
  const r = MAX_RADIUS * ratio;
  return {
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  };
}

export default function SkillsRadarChart() {
  const { activeThemeConfig } = useTheme();
  const { playHover, playClick } = useSound();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeDiscipline = DISCIPLINES[activeIndex] || DISCIPLINES[0];
  const primaryColor = activeThemeConfig?.colorHex || '#00f2fe';
  const accentColor = activeThemeConfig?.accentHex || '#38bdf8';

  // Concentric polygon web rings (20%, 40%, 60%, 80%, 100%)
  const webRings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Data polygon points
  const dataPoints = DISCIPLINES.map((d, i) => getCoordinates(i, d.score / 100));
  const dataPolygonString = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const handleSelectDiscipline = (index) => {
    setActiveIndex(index);
    if (playClick) playClick();
  };

  const handleHoverDiscipline = (index) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
      if (playHover) playHover();
    }
  };

  // Calculate composite readiness index
  const averageScore = (
    DISCIPLINES.reduce((acc, curr) => acc + curr.score, 0) / DISCIPLINES.length
  ).toFixed(1);

  return (
    <div className="mt-14 w-full rounded-3xl bg-surface-container/70 border border-outline-variant hover:border-cyber-cyan/40 p-6 sm:p-8 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(0,242,254,0.18)]">
      {/* Ambient Laser Orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cyber-cyan/10 blur-[90px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cyber-blue/10 blur-[90px] pointer-events-none"></div>

      {/* Header Diagnostic HUD */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-8 border-b border-outline-variant/60 font-mono text-xs gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse"></span>
          <span className="text-white font-semibold tracking-wide uppercase">
            {"// ENGINEERING_CAPABILITY_MATRIX"}
          </span>
          <span className="hidden sm:inline text-on-surface-variant">
            | 6 Core Full-Stack Frontend Disciplines
          </span>
        </div>

        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="text-cyber-cyan flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>READINESS: {averageScore}%</span>
          </span>
          <span className="hidden md:inline text-emerald-400 font-bold">[SENIOR_ALIGNED]</span>
        </div>
      </div>

      {/* Main Grid: Left = SVG Radar Chart, Right = Telemetry Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: SVG Hexagonal Radar Web */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
            <svg
              viewBox="0 0 360 360"
              className="w-full h-full overflow-visible select-none"
            >
              <defs>
                {/* Dynamic Gradient for the Data Polygon */}
                <radialGradient id="cyberRadarGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={primaryColor} stopOpacity="0.45" />
                  <stop offset="70%" stopColor={accentColor} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={primaryColor} stopOpacity="0.05" />
                </radialGradient>

                {/* Glow Filter */}
                <filter id="radarPolygonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={primaryColor} floodOpacity="0.6" />
                </filter>
              </defs>

              {/* 1. Concentric Hexagonal Web Rings */}
              {webRings.map((ringRatio, ringIdx) => {
                const ringPoints = DISCIPLINES.map((_, i) => getCoordinates(i, ringRatio));
                const pointsStr = ringPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
                return (
                  <polygon
                    key={ringIdx}
                    points={pointsStr}
                    fill="none"
                    stroke={primaryColor}
                    strokeOpacity={ringIdx === webRings.length - 1 ? 0.25 : 0.12}
                    strokeWidth={ringIdx === webRings.length - 1 ? 1.4 : 1}
                    strokeDasharray={ringIdx % 2 === 1 ? '3 3' : 'none'}
                  />
                );
              })}

              {/* 2. Axis Spokes radiating from center */}
              {DISCIPLINES.map((_, i) => {
                const outer = getCoordinates(i, 1.0);
                const isSelected = activeIndex === i;
                return (
                  <line
                    key={i}
                    x1={CX}
                    y1={CY}
                    x2={outer.x}
                    y2={outer.y}
                    stroke={isSelected ? primaryColor : `${primaryColor}25`}
                    strokeWidth={isSelected ? 1.6 : 1}
                    className="transition-colors duration-300"
                  />
                );
              })}

              {/* 3. Glowing Data Polygon */}
              <polygon
                points={dataPolygonString}
                fill="url(#cyberRadarGradient)"
                stroke={primaryColor}
                strokeWidth="2.2"
                filter="url(#radarPolygonGlow)"
                className="transition-all duration-500"
              />

              {/* 4. Interactive Vertex Points */}
              {dataPoints.map((point, i) => {
                const isSelected = activeIndex === i;
                return (
                  <g
                    key={i}
                    className="cursor-pointer group"
                    onClick={() => handleSelectDiscipline(i)}
                    onMouseEnter={() => handleHoverDiscipline(i)}
                  >
                    {/* Invisible larger hit circle for easy clicking/hovering */}
                    <circle cx={point.x} cy={point.y} r="18" fill="transparent" />

                    {/* Expanding Radar Wave on Selected Vertex */}
                    {isSelected && (
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="10"
                        fill="none"
                        stroke={primaryColor}
                        strokeWidth="1.5"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Solid Pin Dot */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isSelected ? 5.5 : 4}
                      fill={isSelected ? '#ffffff' : primaryColor}
                      stroke={primaryColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all duration-300 group-hover:scale-125"
                      style={{
                        filter: `drop-shadow(0 0 ${isSelected ? 10 : 5}px ${primaryColor})`,
                      }}
                    />
                  </g>
                );
              })}

              {/* 5. Axis Outer Labels */}
              {DISCIPLINES.map((d, i) => {
                const labelPos = getCoordinates(i, 1.24);
                const isSelected = activeIndex === i;
                return (
                  <text
                    key={i}
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    onClick={() => handleSelectDiscipline(i)}
                    onMouseEnter={() => handleHoverDiscipline(i)}
                    className={`font-mono text-[10.5px] cursor-pointer transition-all duration-300 select-none ${
                      isSelected
                        ? 'fill-white font-bold'
                        : 'fill-on-surface-variant hover:fill-cyber-cyan'
                    }`}
                    style={{
                      filter: isSelected ? `drop-shadow(0 0 6px ${primaryColor})` : 'none',
                    }}
                  >
                    {d.short} ({d.score}%)
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="font-mono text-[11px] text-on-surface-variant/80 mt-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-cyber-cyan">touch_app</span>
            <span>HOVER / CLICK AN AXIS TO INSPECT TELEMETRY</span>
          </div>
        </div>

        {/* Right: Telemetry Inspector Deck */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Quick Select Buttons Grid (Mobile-friendly direct toggles) */}
          <div className="grid grid-cols-3 gap-1.5">
            {DISCIPLINES.map((d, i) => {
              const isSelected = activeIndex === i;
              return (
                <button
                  key={d.id}
                  onClick={() => handleSelectDiscipline(i)}
                  onMouseEnter={() => handleHoverDiscipline(i)}
                  className={`px-2 py-2 rounded-xl font-mono text-[10px] text-center transition-all border truncate ${
                    isSelected
                      ? 'bg-cyber-cyan/15 border-cyber-cyan text-white shadow-[0_0_12px_rgba(0,242,254,0.25)] font-bold'
                      : 'bg-surface-container-high/60 border-outline-variant/50 text-on-surface-variant hover:border-cyber-cyan/40 hover:text-white'
                  }`}
                >
                  <span className="truncate block">{d.short}</span>
                  <span className="text-[9px] text-cyber-blue">{d.score}%</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Inspector Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDiscipline.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-surface-dim/90 border border-cyber-cyan/30 p-5 sm:p-6 backdrop-blur-md flex flex-col gap-4 shadow-xl"
            >
              {/* Discipline Title & Score Counter */}
              <div className="flex items-start justify-between gap-3 border-b border-outline-variant/60 pb-3">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-cyber-cyan tracking-widest uppercase">
                    {"// DISCIPLINE_ANALYSIS"}
                  </span>
                  <h3 className="text-xl font-display font-bold text-white tracking-tight mt-0.5">
                    {activeDiscipline.name}
                  </h3>
                  <p className="text-cyber-blue font-mono text-xs mt-0.5">
                    {activeDiscipline.tagline}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-baseline gap-0.5 font-mono text-2xl font-black text-white">
                    <SlotCounter value={String(activeDiscipline.score)} />
                    <span className="text-sm text-cyber-cyan">%</span>
                  </div>
                  <span className="font-mono text-[9px] text-emerald-400 tracking-wider">
                    [MASTERY_HIGH]
                  </span>
                </div>
              </div>

              {/* Rationale & Description */}
              <p className="text-on-surface-variant text-sm leading-relaxed font-sans">
                {activeDiscipline.description}
              </p>

              {/* Engineering Highlights */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Key Architectural Standards:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeDiscipline.highlights.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full font-mono text-[10.5px] bg-surface-container-highest/80 border border-outline-variant text-on-surface flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-cyber-cyan"></span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stack & Verified Production Builds */}
              <div className="pt-2 border-t border-outline-variant/40 flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between text-[11px] font-mono gap-2">
                  <span className="text-on-surface-variant">Validated In Builds:</span>
                  <div className="flex items-center gap-2">
                    {activeDiscipline.provenIn.map((proof, pIdx) => (
                      <a
                        key={pIdx}
                        href={proof.href}
                        target={proof.href.startsWith('http') ? '_blank' : undefined}
                        rel={proof.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-cyber-cyan hover:underline hover:text-white flex items-center gap-0.5 font-bold transition-colors"
                      >
                        <span>{proof.label}</span>
                        <span className="material-symbols-outlined text-[11px]">arrow_outward</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
