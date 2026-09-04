import React, { useEffect, useState } from "react";
import "./index.css";
import Preloader from "./components/Preloader";
import ParticlesBG from "./components/ParticlesBG";
import MagneticElement from "./components/MagneticElement";
import DecodeText from "./components/DecodeText";
import { SoundProvider, SoundToggle } from "./components/SoundEngine";
import { motion, useScroll, useTransform } from "framer-motion";
import CyberCore3D from "./components/CyberCore3D";
import KineticMarquee from "./components/KineticMarquee";
import CircuitScrollLine from "./components/CircuitScrollLine";
import XRayCard from "./components/XRayCard";
import CursorTrail from "./components/CursorTrail";
import MobileNav from "./components/MobileNav";
import SectionSoundTrigger from "./components/SectionSoundTrigger";

export default function App() {
  const [booting, setBooting] = useState(true);

  // Dynamic Depth of Field (Scroll Blur)
  const { scrollYProgress } = useScroll();
  const backgroundBlur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], ["blur(0px)", "blur(12px)", "blur(12px)", "blur(4px)"]);

  useEffect(() => {
    if (booting) return;

    // 1. Dynamic Cursor Radial Glow Follower
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('pointermove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
      });
    }

    // 2. Interactive 3D Card Tilt with Specular Reflection tracking
    const heroCard = document.getElementById('hero-portrait-card');
    if (heroCard && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const cardContainer = heroCard.closest('.tilt-wrapper');
      
      const handleMove = (e) => {
        const rect = heroCard.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((cardY - centerY) / centerY) * -12; // tilt degrees
        const rotateY = ((cardX - centerX) / centerX) * 12;
        
        heroCard.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        heroCard.style.setProperty('--shine-x', `${(cardX / rect.width) * 100}%`);
        heroCard.style.setProperty('--shine-y', `${(cardY / rect.height) * 100}%`);
      };

      const handleLeave = () => {
        heroCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        heroCard.style.setProperty('--shine-x', `50%`);
        heroCard.style.setProperty('--shine-y', `50%`);
      };

      cardContainer.addEventListener('mousemove', handleMove);
      cardContainer.addEventListener('mouseleave', handleLeave);
    }

    // 3. Scroll-Driven IntersectionObserver for elements with .reveal-on-scroll
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // 4. Subtle Terminal Brand Text Glitch / Hover Effect
    const terminalBrand = document.getElementById('terminal-brand');
    if (terminalBrand) {
      const originalText = "~/karansingh-hajari";
      const glitchChars = "!<>-_\\/[]{}—=+*^?#________";
      let interval = null;

      terminalBrand.addEventListener('mouseenter', () => {
        let iteration = 0;
        clearInterval(interval);
        interval = setInterval(() => {
          terminalBrand.innerText = originalText
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return originalText[index];
              }
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join("");

          if (iteration >= originalText.length) {
            clearInterval(interval);
          }
          iteration += 1 / 2;
        }, 25);
      });
    }

    // 5. Simulated Terminal Command Typewriter Loop for CLI block
    const typewriterEl = document.getElementById('typewriter-cli');
    if (typewriterEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const commands = [
        "npx karansingh-hajari --portfolio",
        "git status // all modules clean",
        "npm run build --mode=production",
        "npx karansingh-hajari --contact"
      ];
      let cmdIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typingDelay = 120;

      function typeLoop() {
        const currentCmd = commands[cmdIndex];
        
        if (isDeleting) {
          typewriterEl.textContent = currentCmd.substring(0, charIndex - 1);
          charIndex--;
          typingDelay = 45;
        } else {
          typewriterEl.textContent = currentCmd.substring(0, charIndex + 1);
          charIndex++;
          typingDelay = 95;
        }

        if (!isDeleting && charIndex === currentCmd.length) {
          typingDelay = 3200; // Pause at full word
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          cmdIndex = (cmdIndex + 1) % commands.length;
          typingDelay = 600; // Pause before new word
        }

        setTimeout(typeLoop, typingDelay);
      }
      
      // Delay start so initial entrance settles
      setTimeout(typeLoop, 2000);
    }
  }, [booting]);

  if (booting) {
    return <Preloader onComplete={() => setBooting(false)} />;
  }

  return (
    <SoundProvider>
      <SectionSoundTrigger />
      <SoundToggle />
      <MobileNav />
      <CursorTrail />
      <CircuitScrollLine />
      <div className="crt-overlay pointer-events-none fixed inset-0 z-50"></div>
        <motion.div style={{ filter: backgroundBlur }} className="fixed inset-0 z-0 pointer-events-none">
          <KineticMarquee text="FRONT-END ENGINEER • UI/UX • CYBER-TECH " />
          <ParticlesBG />
        </motion.div>

{/* Cursor Dynamic Spotlight */}
<div id="cursor-glow" style={{ left: "-999px", top: "-999px" }}></div>
{/* Scanline Overlay */}
<div className="fixed inset-0 scanline z-40 opacity-40 pointer-events-none"></div>
{/* Ambient Laser Orbs */}
<div className="fixed top-10 left-1/4 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-cyber-blue/10 blur-[140px] pointer-events-none -z-10"></div>
<div className="fixed top-96 right-10 w-[30rem] h-[30rem] rounded-full bg-cyber-cyan/10 blur-[150px] pointer-events-none -z-10"></div>
<div className="fixed bottom-20 left-1/3 w-[34rem] h-[34rem] rounded-full bg-cyber-violet/10 blur-[160px] pointer-events-none -z-10"></div>
{/* Top Navigation (Terminal Bar) */}
<header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/60 animate-enter">
<div className="h-16 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
{/* Brand & Shell Prompt with dynamic glitch/typing effect */}
<a className="flex items-center gap-2 font-mono group" href="#home">
<span className="text-cyber-cyan font-bold tracking-tight" id="terminal-brand">~/karansingh-hajari</span>
<span className="text-cyber-blue font-semibold text-sm opacity-80 group-hover:opacity-100 transition-opacity">$ <span className="animate-pulse">_</span></span>
</a>
{/* Terminal Navigation Links */}
<nav className="hidden md:flex items-center gap-6 font-mono text-xs tracking-wider">
<a className="text-cyber-cyan hover:text-white transition-colors flex items-center gap-1.5 hover:translate-x-0.5 duration-200" href="#home">
<span className="text-cyber-blue/60">[00]</span> Home
        </a>
<a className="text-on-surface-variant hover:text-cyber-cyan transition-colors flex items-center gap-1.5 hover:translate-x-0.5 duration-200" href="#about">
<span className="text-cyber-blue/40">[01]</span> About
        </a>
<a className="text-on-surface-variant hover:text-cyber-cyan transition-colors flex items-center gap-1.5 hover:translate-x-0.5 duration-200" href="#skills">
<span className="text-cyber-blue/40">[02]</span> Core Stack
        </a>
<a className="text-on-surface-variant hover:text-cyber-cyan transition-colors flex items-center gap-1.5 hover:translate-x-0.5 duration-200" href="#work">
<span className="text-cyber-blue/40">[03]</span> Selected Work
        </a>
<a className="text-on-surface-variant hover:text-cyber-cyan transition-colors flex items-center gap-1.5 hover:translate-x-0.5 duration-200" href="#contact">
<span className="text-cyber-blue/40">[04]</span> Contact
        </a>
</nav>
{/* Telemetry Status & External Hub */}
<div className="flex items-center gap-3">
<div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 border border-cyber-cyan/30 text-[11px] font-mono hover:border-cyber-cyan transition-colors">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span>
</span>
<span className="text-cyber-cyan tracking-wide font-medium">OPEN TO WORK</span>
</div>
<a className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant hover:border-cyber-blue/50 text-on-surface transition-all flex items-center gap-1 text-xs font-mono hover:scale-105 active:scale-95" href="https://github.com/Procax?tab=repositories" rel="noopener noreferrer" target="_blank" title="GitHub Profile">
<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
<path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
</svg>
<span className="hidden lg:inline">GitHub</span>
</a>
</div>
</div>
</header>
<main className="w-full pt-20">
{/* ==================== 01. HERO SECTION ==================== */}
<section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-16" id="home">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
{/* Left Hero Column */}
<div className="lg:col-span-7 flex flex-col items-start gap-6">
{/* System Terminal Status Pill */}
<div className="animate-enter delay-100 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/90 border border-cyber-cyan/40 text-xs font-mono shadow-[0_0_15px_-3px_rgba(0,242,254,0.3)]">
<span className="inline-block w-2 h-2 rounded-full bg-cyber-cyan animate-ping"></span>
<span className="text-cyber-cyan font-medium">SYS.INIT // KARANSINGH_HAJARI</span>
<span className="text-on-surface-variant font-light">| Available for your next build</span>
</div>
{/* Main Title & Typographic Gradient with Iridescent Wave */}
<div className="animate-enter delay-200 flex flex-col gap-2">
<p className="font-mono text-sm md:text-base text-cyber-blue tracking-wide flex items-center gap-2">
<span className="text-cyber-cyan">const</span> dev = <span className="text-tertiary">"KaranSinghHajari"</span>;
            </p>
<h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.08] text-white">
              Hello, I'm <br />
<span className="text-white">KaranSinghHajari</span>
</h1>
<div className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight">
<span className="text-white">Front-end </span>
{/* Flowing Iridescent Neon Gradient */}
<span className="animated-gradient-text font-extrabold drop-shadow-[0_0_20px_rgba(0,242,254,0.4)]">Developer</span>
</div>
</div>
{/* Terminal CLI Simulation Tag with live interactive typing / copy */}
<div className="animate-enter delay-300 w-full max-w-lg rounded-xl bg-surface-container-highest/60 border border-outline-variant/80 p-3 font-mono text-xs flex items-center justify-between text-on-surface-variant hover:border-cyber-cyan/40 transition-colors shadow-lg">
<div className="flex items-center gap-2 overflow-hidden">
<span className="text-cyber-cyan font-bold">$</span>
<span className="text-on-surface truncate" id="typewriter-cli">npx karansingh-hajari --portfolio</span>
<span className="w-1.5 h-3.5 bg-cyber-cyan animate-pulse"></span>
</div>
<button className="px-2 py-1 rounded bg-surface-container hover:bg-surface border border-outline-variant hover:border-cyber-cyan/50 text-[10px] text-cyber-cyan uppercase font-bold tracking-wider transition-all active:scale-95 shrink-0" onClick={(e) => { navigator.clipboard.writeText('npx karansingh-hajari --portfolio'); const btn = e.target; btn.innerText='COPIED!'; setTimeout(() => btn.innerText='COPY', 2000); }}>
              Copy
            </button>
</div>
<p className="animate-enter delay-400 text-on-surface-variant text-base sm:text-lg max-w-xl leading-relaxed">
            I craft refined, resilient digital interfaces that harmonize modern visual aesthetics with crisp front-end engineering. Specializing in responsive systems, React component architectures, and intuitive web performance.
          </p>
{/* CTAs with rich hover interactions */}
<div className="animate-enter delay-500 flex flex-wrap items-center gap-4 pt-2">
<MagneticElement><a className="btn-cyber-primary haptic-ripple inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-cyan text-surface-dim font-mono text-sm font-bold glow-cyan hover:shadow-[0_0_32px_rgba(0,242,254,0.6)] hover:scale-[1.03] transition-all" href="#work">
<span>View Selected Work</span>
<span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">terminal</span>
</a></MagneticElement>
<MagneticElement><a className="haptic-ripple inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant hover:border-cyber-cyan/50 text-white font-mono text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]" href="#contact">
<span className="material-symbols-outlined text-[18px] text-cyber-cyan">mail</span>
<span>Contact Me</span>
</a></MagneticElement>
</div>
{/* Live Diagnostic Badges */}
<div className="animate-enter delay-600 flex flex-wrap items-center gap-3 pt-4 border-t border-outline-variant/40 w-full max-w-lg font-mono text-xs text-on-surface-variant">
<span className="flex items-center gap-1.5 hover:text-white transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>React 18+</span>
<span className="flex items-center gap-1.5 hover:text-white transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-cyber-blue"></span>ES6+ JS</span>
<span className="flex items-center gap-1.5 hover:text-white transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Tailwind &amp; CSS3</span>
<span className="flex items-center gap-1.5 hover:text-white transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Responsive Layouts</span>
</div>
</div>
{/* Right Profile Visual Column (Interactive 3D Tilt Card + Laser Scanner Line) */}
<div className="lg:col-span-5 flex justify-center lg:justify-end animate-enter delay-400">
<div className="tilt-wrapper relative w-full max-w-sm sm:max-w-md aspect-square">
{/* Cybernetic Corner Accents */}
<div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan z-30 transition-transform duration-300"></div>
<div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan z-30 transition-transform duration-300"></div>
<div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan z-30 transition-transform duration-300"></div>
<div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan z-30 transition-transform duration-300"></div>
{/* Outer Glowing Halo with subtle pulsating breath */}
<div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-cyber-blue/30 via-cyber-cyan/20 to-cyber-violet/30 blur-xl opacity-75 animate-pulse" style={{ animationDuration: "4s" }}></div>
{/* Main Portrait Window Card with 3D Mouse Tilt */}
<div className="tilt-card relative w-full h-full rounded-2xl overflow-hidden bg-surface-container border border-cyber-cyan/40 p-2 glow-blue flex flex-col cursor-crosshair" id="hero-portrait-card">
<CyberCore3D />
{/* Dynamic Specular Reflection Overlay */}
<div className="tilt-reflection rounded-2xl"></div>
{/* Card Terminal Header Bar */}
<div className="h-7 px-3 bg-surface-container-highest/80 rounded-t-xl flex items-center justify-between border-b border-outline-variant/60 font-mono text-[11px] text-on-surface-variant relative z-20">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
<span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
<span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
</div>
<span className="text-cyber-cyan font-medium">karansingh.portrait.raw</span>
<span className="text-cyber-blue font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>LIVE</span>
</div>
{/* Real Photo Render with Vertical Laser Scan */}
<div className="relative w-full flex-1 rounded-b-xl overflow-hidden group">
{/* Animated Holographic Laser Scanner Line */}
<div className="laser-scan-line"></div>
<img alt="KaranSinghHajari" className="w-full h-full object-cover object-center filter grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105" src="/profile.jpg" />
{/* Monospace Floating HUD Overlays */}
<div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-surface/85 backdrop-blur-md border border-cyber-cyan/30 flex items-center justify-between font-mono text-xs shadow-xl transition-all duration-300 group-hover:border-cyber-cyan/60 group-hover:bg-surface/95 z-20">
<div>
<div className="text-[10px] text-cyber-cyan uppercase font-bold tracking-wider">Developer Node</div>
<div className="text-white font-semibold text-xs">KaranSinghHajari</div>
</div>
<div className="text-right">
<div className="text-[10px] text-on-surface-variant uppercase">Stack Focus</div>
<div className="text-cyber-blue font-semibold text-xs">Front-End UI/UX</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/* ==================== 02. ABOUT SECTION ==================== */}
<section className="max-w-5xl mx-auto px-4 md:px-8 py-16" id="about">
{/* Section Header with scroll reveal */}
<div className="reveal-on-scroll flex flex-col items-center text-center gap-2 mb-10">
<div className="font-mono text-xs text-cyber-cyan tracking-widest uppercase flex items-center gap-2">
<span>{"// 01. PROFILE_LOG"}</span>
</div>
<h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight glitch-hover" data-text="About">About</h2>
<div className="w-16 h-1 bg-gradient-to-r from-cyber-blue to-cyber-cyan rounded-full mt-1"></div>
</div>
{/* Cyber Terminal Container with reveal and hover elevation */}
<div className="reveal-on-scroll rounded-2xl bg-surface-container/70 border border-outline-variant/80 hover:border-cyber-cyan/50 p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_35px_-5px_rgba(0,242,254,0.18)] group">
{/* Terminal Header Controls */}
<div className="flex items-center justify-between pb-4 mb-6 border-b border-outline-variant/60 font-mono text-xs">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block transition-transform group-hover:scale-110"></span>
<span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block transition-transform group-hover:scale-110"></span>
<span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block transition-transform group-hover:scale-110"></span>
<span className="text-on-surface-variant ml-2">bio.config.json</span>
</div>
<span className="text-cyber-cyan flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>[STATUS: COMPILED]</span>
</div>
{/* Authentic Bio Text from Image 2 */}
<div className="space-y-4 text-on-surface-variant font-sans text-base sm:text-lg leading-relaxed max-w-3xl mx-auto text-center md:text-left">
<p className="text-on-surface">
            I design and build refined digital experiences that blend strong visual design with dependable front-end performance. With a solid foundation in <span className="text-cyber-cyan font-mono font-medium transition-colors hover:underline">HTML</span>, <span className="text-cyber-cyan font-mono font-medium transition-colors hover:underline">CSS</span>, <span className="text-cyber-cyan font-mono font-medium transition-colors hover:underline">JavaScript</span>, and <span className="text-cyber-blue font-mono font-semibold transition-colors hover:underline">React</span>, I turn ideas into responsive, accessible interfaces that feel fast, clear, and intuitive.
          </p>
<p>
            I enjoy translating product goals into thoughtful user experiences that are clean, scalable, and built to make an impact. Constantly learning and refining my craft, I focus on creating work that is both visually polished and genuinely useful.
          </p>
</div>
{/* Terminal Signature Footer */}
<div className="mt-8 pt-4 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-on-surface-variant">
<span className="text-cyber-blue">❯ karan.focus: ["Front-end Architecture", "React SPAs", "Clean Code"]</span>
<span className="text-cyber-cyan">v2.4.2_stable</span>
</div>
</div>
</section>
{/* ==================== 03. CORE STACK SECTION ==================== */}
<section className="max-w-6xl mx-auto px-4 md:px-8 py-16" id="skills">
{/* Section Header */}
<div className="reveal-on-scroll flex flex-col items-center text-center gap-2 mb-12">
<div className="font-mono text-xs text-cyber-cyan tracking-widest uppercase flex items-center gap-2">
<span>{"// 02. SYSTEM_TOOLKIT"}</span>
</div>
<h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight glitch-hover" data-text="Core Stack">Core Stack</h2>
<div className="w-16 h-1 bg-gradient-to-r from-cyber-blue to-cyber-cyan rounded-full mt-1"></div>
<p className="text-on-surface-variant font-mono text-xs mt-2">Engineered with high-reliability technologies &amp; modern tools</p>
</div>
{/* Core Stack Bento Grid with Staggered Scroll Reveal */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
{/* 1. HTML5 */}
<div className="stack-card reveal-on-scroll group p-6 rounded-xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant hover:border-cyber-cyan/70 flex flex-col items-center text-center gap-3 cursor-pointer" style={{ transitionDelay: "50ms" }}>
<div className="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center text-cyber-cyan group-hover:scale-110 group-hover:glow-cyan group-hover:bg-cyber-cyan/10 transition-all duration-300">
{/* HTML5 Shield Icon */}
<svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
<path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm0 4.18l6 2-1 9-5 1.5-5-1.5-1-9 6-2z"></path>
</svg>
</div>
<span className="font-mono text-sm font-bold text-white group-hover:text-cyber-cyan transition-colors">HTML5</span>
<span className="font-mono text-[11px] text-cyber-blue">Semantic &amp; SEO</span>
</div>
{/* 2. CSS3 */}
<div className="stack-card reveal-on-scroll group p-6 rounded-xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant hover:border-cyber-blue/70 flex flex-col items-center text-center gap-3 cursor-pointer" style={{ transitionDelay: "100ms" }}>
<div className="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center text-cyber-blue group-hover:scale-110 group-hover:glow-blue group-hover:bg-cyber-blue/10 transition-all duration-300">
<svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
<path d="M3 3h18l-2 15-7 3-7-3L3 3zm15 4H6l.4 3h11.2l-.6 6-5 2-5-2-.3-2.5h2.5l.1 1 2.7 1.1 2.7-1.1.3-2.5H6.8L6 4h12V7z"></path>
</svg>
</div>
<span className="font-mono text-sm font-bold text-white group-hover:text-cyber-blue transition-colors">CSS3 / Styling</span>
<span className="font-mono text-[11px] text-cyber-blue">Flexbox &amp; Grid</span>
</div>
{/* 3. JavaScript (JS) */}
<div className="stack-card reveal-on-scroll group p-6 rounded-xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant hover:border-amber-400/70 flex flex-col items-center text-center gap-3 cursor-pointer" style={{ transitionDelay: "150ms" }}>
<div className="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] group-hover:bg-amber-400/10 transition-all duration-300 font-mono font-extrabold text-2xl">
            JS
          </div>
<span className="font-mono text-sm font-bold text-white group-hover:text-amber-400 transition-colors">JavaScript</span>
<span className="font-mono text-[11px] text-amber-400">ES6+ &amp; Async/DOM</span>
</div>
{/* 4. React */}
<div className="stack-card reveal-on-scroll group p-6 rounded-xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant hover:border-cyber-cyan/70 flex flex-col items-center text-center gap-3 cursor-pointer" style={{ transitionDelay: "200ms" }}>
<div className="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center text-cyber-cyan group-hover:scale-110 group-hover:glow-cyan group-hover:bg-cyber-cyan/10 transition-all duration-300">
<svg className="w-8 h-8 fill-current animate-spin" style={{ animationDuration: "12s" }} viewBox="0 0 24 24">
<ellipse cx="12" cy="12" fill="none" rx="10" ry="4.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(0 12 12)"></ellipse>
<ellipse cx="12" cy="12" fill="none" rx="10" ry="4.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)"></ellipse>
<ellipse cx="12" cy="12" fill="none" rx="10" ry="4.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)"></ellipse>
<circle cx="12" cy="12" fill="currentColor" r="2"></circle>
</svg>
</div>
<span className="font-mono text-sm font-bold text-white group-hover:text-cyber-cyan transition-colors"><DecodeText text="React.js" /></span>
<span className="font-mono text-[11px] text-cyber-cyan">Hooks &amp; SPAs</span>
</div>
{/* 5. VS Code */}
<div className="stack-card reveal-on-scroll group p-6 rounded-xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant hover:border-sky-400/70 flex flex-col items-center text-center gap-3 cursor-pointer" style={{ transitionDelay: "250ms" }}>
<div className="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] group-hover:bg-sky-400/10 transition-all duration-300">
<span className="material-symbols-outlined text-3xl">code</span>
</div>
<span className="font-mono text-sm font-bold text-white group-hover:text-sky-400 transition-colors">VS Code</span>
<span className="font-mono text-[11px] text-on-surface-variant">Primary IDE</span>
</div>
{/* 6. Git */}
<div className="stack-card reveal-on-scroll group p-6 rounded-xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant hover:border-orange-400/70 flex flex-col items-center text-center gap-3 cursor-pointer" style={{ transitionDelay: "300ms" }}>
<div className="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(251,146,60,0.3)] group-hover:bg-orange-400/10 transition-all duration-300">
<svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
<path d="M19.5 9.5l-7-7c-.6-.6-1.5-.6-2.1 0L8.5 4.4l3.1 3.1c.4-.1.9 0 1.2.3.6.6.6 1.5 0 2.1-.3.3-.8.4-1.2.3l-2.6 2.6c.1.4 0 .9-.3 1.2-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1.3-.3.8-.4 1.2-.3l2.6-2.6V6.7L4.4 12.6c-.6.6-.6 1.5 0 2.1l7 7c.6.6 1.5.6 2.1 0l6-6c.6-.6.6-1.5 0-2.1z"></path>
</svg>
</div>
<span className="font-mono text-sm font-bold text-white group-hover:text-orange-400 transition-colors">Git</span>
<span className="font-mono text-[11px] text-orange-400">Version Control</span>
</div>
{/* 7. GitHub */}
<div className="stack-card reveal-on-scroll group p-6 rounded-xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant hover:border-white/80 flex flex-col items-center text-center gap-3 cursor-pointer" style={{ transitionDelay: "350ms" }}>
<div className="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] group-hover:bg-white/10 transition-all duration-300">
<svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
<path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
</svg>
</div>
<span className="font-mono text-sm font-bold text-white group-hover:text-white transition-colors">GitHub</span>
<span className="font-mono text-[11px] text-on-surface-variant">CI/CD &amp; Collaboration</span>
</div>
{/* 8. Bootstrap & Frameworks */}
<div className="stack-card reveal-on-scroll group p-6 rounded-xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant hover:border-purple-400/70 flex flex-col items-center text-center gap-3 cursor-pointer" style={{ transitionDelay: "400ms" }}>
<div className="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(192,132,252,0.3)] group-hover:bg-purple-400/10 transition-all duration-300 font-display font-extrabold text-2xl">
            B
          </div>
<span className="font-mono text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Bootstrap / UI</span>
<span className="font-mono text-[11px] text-purple-400">Component Frameworks</span>
</div>
</div>
</section>
{/* ==================== 04. SELECTED WORK SECTION ==================== */}
<section className="max-w-7xl mx-auto px-4 md:px-8 py-16" id="work">
{/* Section Header */}
<div className="reveal-on-scroll flex flex-col items-center text-center gap-2 mb-12">
<div className="font-mono text-xs text-cyber-cyan tracking-widest uppercase flex items-center gap-2">
<span>{"// 03. SHIPPED_BUILDS"}</span>
</div>
<h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight glitch-hover" data-text="Selected Work">Selected Work</h2>
<div className="w-16 h-1 bg-gradient-to-r from-cyber-blue to-cyber-cyan rounded-full mt-1"></div>
<p className="text-on-surface-variant font-mono text-xs mt-2">Production web applications &amp; interactive systems</p>
</div>
{/* Project Cards Grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
{/* PROJECT 1: Youtube-Clone (Exact from Image 2 with micro-interactions) */}
<XRayCard className="reveal-on-scroll" style={{ transitionDelay: "100ms" }}>
<article className="project-card group rounded-2xl bg-surface-container/70 border border-outline-variant hover:border-cyber-cyan/80 overflow-hidden backdrop-blur-md transition-all duration-500 flex flex-col justify-between h-full">
{/* Terminal Mockup Window Header */}
<div className="h-8 px-4 bg-surface-container-highest/90 flex items-center justify-between border-b border-outline-variant/60 font-mono text-xs">
<div className="flex items-center gap-2">
<span className="window-dot w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
<span className="window-dot w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
<span className="window-dot w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
<span className="text-on-surface-variant ml-2 text-[11px]">app.youtube-clone.local</span>
</div>
<span className="text-cyber-cyan text-[11px] font-bold tracking-wider">REACT + REDUX</span>
</div>
{/* Video Player & Feed Preview Mockup */}
<div className="relative h-60 w-full bg-surface-dim overflow-hidden p-3 flex flex-col gap-2 group-hover:bg-surface-dim/80 transition-colors">
{/* Simulated YouTube Top Nav */}
<div className="h-6 w-full rounded bg-surface-container-high flex items-center justify-between px-2 text-[10px] font-mono text-on-surface-variant">
<span className="text-rose-400 font-bold flex items-center gap-1">▶ YouTube</span>
<div className="w-36 h-3 rounded bg-surface-container-highest"></div>
<div className="w-4 h-4 rounded-full bg-cyber-blue/30"></div>
</div>
{/* Video Grid Simulation */}
<div className="grid grid-cols-3 gap-2 flex-1">
<div className="bg-surface-container-high rounded p-1.5 flex flex-col justify-between group-hover:border group-hover:border-cyber-cyan/30 transition-all">
<div className="w-full h-16 rounded bg-gradient-to-tr from-cyber-blue/20 to-cyber-cyan/10 flex items-center justify-center">
<span className="material-symbols-outlined text-cyber-cyan text-xl group-hover:scale-125 transition-transform duration-300">play_circle</span>
</div>
<div className="space-y-1 mt-1">
<div className="h-2 w-full bg-surface-container-highest rounded"></div>
<div className="h-2 w-2/3 bg-surface-container-highest/60 rounded"></div>
</div>
</div>
<div className="bg-surface-container-high rounded p-1.5 flex flex-col justify-between group-hover:border group-hover:border-purple-500/30 transition-all">
<div className="w-full h-16 rounded bg-gradient-to-tr from-purple-500/20 to-rose-500/10 flex items-center justify-center">
<span className="material-symbols-outlined text-purple-400 text-xl group-hover:scale-125 transition-transform duration-300">play_circle</span>
</div>
<div className="space-y-1 mt-1">
<div className="h-2 w-full bg-surface-container-highest rounded"></div>
<div className="h-2 w-1/2 bg-surface-container-highest/60 rounded"></div>
</div>
</div>
<div className="bg-surface-container-high rounded p-1.5 flex flex-col justify-between group-hover:border group-hover:border-amber-500/30 transition-all">
<div className="w-full h-16 rounded bg-gradient-to-tr from-amber-500/20 to-emerald-500/10 flex items-center justify-center">
<span className="material-symbols-outlined text-amber-400 text-xl group-hover:scale-125 transition-transform duration-300">play_circle</span>
</div>
<div className="space-y-1 mt-1">
<div className="h-2 w-full bg-surface-container-highest rounded"></div>
<div className="h-2 w-3/4 bg-surface-container-highest/60 rounded"></div>
</div>
</div>
</div>
{/* Overlay subtle scanline */}
<div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-60"></div>
</div>
{/* Project Details (Authentic to Image 2) */}
<div className="p-6 flex flex-col gap-4 flex-1 justify-between">
<div>
<h3 className="text-2xl font-display font-bold text-white group-hover:text-cyber-cyan transition-colors">
                Youtube-Clone
              </h3>
<p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
                A fully responsive YouTube clone application built with real-time video feeds, custom search indexing, responsive navigation drawers, and dynamic category filters.
              </p>
</div>
{/* Tech Pills (Exact match from Image 2) */}
<div className="flex flex-wrap items-center gap-2 pt-2">
<span className="px-2.5 py-1 rounded-full font-mono text-xs bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 hover:border-cyber-blue transition-colors">React</span>
<span className="px-2.5 py-1 rounded-full font-mono text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:border-purple-500 transition-colors">Redux</span>
<span className="px-2.5 py-1 rounded-full font-mono text-xs bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 hover:border-cyber-cyan transition-colors">Tailwind CSS</span>
<span className="px-2.5 py-1 rounded-full font-mono text-xs bg-amber-400/10 text-amber-300 border border-amber-400/20 hover:border-amber-400 transition-colors">JavaScript</span>
</div>
{/* Action Link buttons */}
<div className="flex items-center gap-4 pt-3 border-t border-outline-variant/60 font-mono text-xs">
<a className="text-cyber-cyan hover:underline flex items-center gap-1 group/link" href="https://yotube-clone-kappa.vercel.app/">
  <span>Live Showcase</span>
<span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">open_in_new</span>
</a>
<a className="text-on-surface-variant hover:text-white flex items-center gap-1 group/link" href="https://github.com/Procax/Yotube-clone" target="_blank" rel="noopener noreferrer">
<span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/link:rotate-12">code</span>
<span>Source Code</span>
</a>
</div>
</div>
</article>
</XRayCard>
{/* PROJECT 2: Pokedex-App (Exact from Image 2 with micro-interactions) */}
<XRayCard className="reveal-on-scroll" style={{ transitionDelay: "200ms" }}>
<article className="project-card group rounded-2xl bg-surface-container/70 border border-outline-variant hover:border-cyber-blue/80 overflow-hidden backdrop-blur-md transition-all duration-500 flex flex-col justify-between h-full">
{/* Terminal Mockup Window Header */}
<div className="h-8 px-4 bg-surface-container-highest/90 flex items-center justify-between border-b border-outline-variant/60 font-mono text-xs">
<div className="flex items-center gap-2">
<span className="window-dot w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
<span className="window-dot w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
<span className="window-dot w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
<span className="text-on-surface-variant ml-2 text-[11px]">app.pokedex.archive</span>
</div>
<span className="text-cyber-blue text-[11px] font-bold tracking-wider">POKE-API ENGINE</span>
</div>
{/* Pokedex Retro Card Preview Mockup (Faithfully recreating Image 2 visual) */}
<div className="relative h-60 w-full bg-surface-dim overflow-hidden p-3 flex flex-col justify-center group-hover:bg-surface-dim/80 transition-colors">
<div className="grid grid-cols-4 gap-2">
{/* Bulbasaur */}
<div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">#01</div>
<span className="font-mono text-[10px] text-emerald-300 mt-1 font-semibold">bulbasaur</span>
</div>
{/* Ivysaur */}
<div className="rounded-lg bg-teal-950/40 border border-teal-500/30 hover:border-teal-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-mono text-xs font-bold">#02</div>
<span className="font-mono text-[10px] text-teal-300 mt-1 font-semibold">ivysaur</span>
</div>
{/* Venusaur */}
<div className="rounded-lg bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">#03</div>
<span className="font-mono text-[10px] text-cyan-300 mt-1 font-semibold">venusaur</span>
</div>
{/* Charmander */}
<div className="rounded-lg bg-rose-950/40 border border-rose-500/30 hover:border-rose-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">#04</div>
<span className="font-mono text-[10px] text-rose-300 mt-1 font-semibold">charmander</span>
</div>
</div>
{/* Second Row Mockup */}
<div className="grid grid-cols-4 gap-2 mt-2">
<div className="rounded-lg bg-orange-950/40 border border-orange-500/30 hover:border-orange-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-mono text-xs font-bold">#05</div>
<span className="font-mono text-[10px] text-orange-300 mt-1 font-semibold">charmeleon</span>
</div>
<div className="rounded-lg bg-red-950/40 border border-red-500/30 hover:border-red-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-mono text-xs font-bold">#06</div>
<span className="font-mono text-[10px] text-red-300 mt-1 font-semibold">charizard</span>
</div>
<div className="rounded-lg bg-sky-950/40 border border-sky-500/30 hover:border-sky-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-mono text-xs font-bold">#07</div>
<span className="font-mono text-[10px] text-sky-300 mt-1 font-semibold">squirtle</span>
</div>
<div className="rounded-lg bg-blue-950/40 border border-blue-500/30 hover:border-blue-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-xs font-bold">#08</div>
<span className="font-mono text-[10px] text-blue-300 mt-1 font-semibold">wartortle</span>
</div>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-50 pointer-events-none"></div>
</div>
{/* Project Details (Authentic to Image 2) */}
<div className="p-6 flex flex-col gap-4 flex-1 justify-between">
<div>
<h3 className="text-2xl font-display font-bold text-white group-hover:text-cyber-blue transition-colors">
                Pokedex-App
              </h3>
<p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
                A classic Pokedex app to search and view details. Integrates the PokeAPI for stats, evolutions, abilities, and dynamic card styling based on creature types.
              </p>
</div>
{/* Tech Pills (Exact match from Image 2) */}
<div className="flex flex-wrap items-center gap-2 pt-2">
<span className="px-2.5 py-1 rounded-full font-mono text-xs bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 hover:border-cyber-blue transition-colors">React</span>
<span className="px-2.5 py-1 rounded-full font-mono text-xs bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 hover:border-cyber-cyan transition-colors">CSS</span>
<span className="px-2.5 py-1 rounded-full font-mono text-xs bg-amber-400/10 text-amber-300 border border-amber-400/20 hover:border-amber-400 transition-colors">JavaScript</span>
</div>
{/* Action Link buttons */}
<div className="flex items-center gap-4 pt-3 border-t border-outline-variant/60 font-mono text-xs">
<a className="text-cyber-blue hover:underline flex items-center gap-1 group/link" href="https://pokemon-teal-eight-81.vercel.app/pokemon">
  <span>Launch Pokedex</span>
<span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">open_in_new</span>
</a>
<a className="text-on-surface-variant hover:text-white flex items-center gap-1 group/link" href="https://github.com/Procax/pokemon" target="_blank" rel="noopener noreferrer">
<span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/link:rotate-12">code</span>
<span>GitHub Repo</span>
</a>
</div>
</div>
</article>
</XRayCard></div>
</section>
{/* ==================== 05. CONTACT SECTION ==================== */}
<section className="max-w-4xl mx-auto px-4 md:px-8 py-16 mb-12" id="contact">
{/* Terminal Contact Card (Faithful to Image 2 "Contact me") with scroll reveal & interactive form glow */}
<div className="reveal-on-scroll rounded-3xl bg-surface-container/70 border border-outline-variant p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl transition-all duration-500 hover:border-cyber-cyan/40 hover:shadow-[0_0_40px_-10px_rgba(0,242,254,0.2)]">
{/* Ambient Laser Flairs inside Contact */}
<div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyber-cyan/10 blur-[100px] pointer-events-none"></div>
<div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyber-blue/10 blur-[100px] pointer-events-none"></div>
<div className="relative z-10 flex flex-col items-center text-center gap-3 mb-8">
<div className="font-mono text-xs text-cyber-cyan tracking-widest uppercase">
<span>{"// 04. TRANSMISSION_PORT"}</span>
</div>
<h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight glitch-hover" data-text="Contact me">Contact me</h2>
<div className="w-16 h-1 bg-gradient-to-r from-cyber-blue to-cyber-cyan rounded-full"></div>
<p className="text-on-surface-variant text-sm sm:text-base max-w-lg mt-2">
            I'd love to hear about your project and how I can help. Share a few details below, and I'll get back to you shortly.
          </p>
</div>
{/* Terminal Form */}
<form className="relative z-10 max-w-xl mx-auto flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); alert('Transmission dispatched to KaranSinghHajari.'); }}>
{/* Name Field */}
<div className="flex flex-col gap-1 text-left">
<label className="font-mono text-xs text-cyber-cyan uppercase tracking-wider">Name</label>
<input className="cyber-input w-full px-4 py-3 rounded-xl bg-surface-dim/90 border border-outline-variant/80 text-white font-sans text-sm focus:outline-none placeholder:text-outline/70" placeholder="Your name or organization" required type="text" />
</div>
{/* Email Field */}
<div className="flex flex-col gap-1 text-left">
<label className="font-mono text-xs text-cyber-cyan uppercase tracking-wider">Email</label>
<input className="cyber-input w-full px-4 py-3 rounded-xl bg-surface-dim/90 border border-outline-variant/80 text-white font-sans text-sm focus:outline-none placeholder:text-outline/70" placeholder="name@domain.com" required type="email" />
</div>
{/* Message Field */}
<div className="flex flex-col gap-1 text-left">
<label className="font-mono text-xs text-cyber-cyan uppercase tracking-wider">Message</label>
<textarea className="cyber-input w-full px-4 py-3 rounded-xl bg-surface-dim/90 border border-outline-variant/80 text-white font-sans text-sm focus:outline-none placeholder:text-outline/70 resize-none" placeholder="Tell me about your product requirements, deadlines, or role..." required rows="4"></textarea>
</div>
{/* Send Message Button (Faithful to Image 2 Blue Button with radar pulse effect) */}
<div className="pt-2 flex justify-center">
<button className="btn-cyber-primary w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-cyan text-surface-dim font-mono text-sm font-bold glow-cyan hover:shadow-[0_0_32px_rgba(0,242,254,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group" type="submit">
<span>Send Message</span>
<span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">send</span>
</button>
</div>
<div className="text-center font-mono text-[11px] text-on-surface-variant flex items-center justify-center gap-1.5 pt-1">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
<span>Direct pipeline: karansinghhajari@gmail.com</span>
</div>
</form>
</div>
</section>
</main>
{/* ==================== FOOTER ==================== */}
<footer className="w-full bg-surface-dim border-t border-outline-variant/50 py-10">
<div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
{/* Brand & Copyright */}
<div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left font-mono">
<span className="font-display font-bold text-white text-base tracking-tight">KaranSinghHajari</span>
<span className="text-xs text-on-surface-variant">© 2026 All rights reserved.</span>
</div>
{/* Social Icons (Faithful to Image 2: Facebook, Instagram, GitHub) */}
<div className="flex items-center gap-4">
{/* Facebook */}
<a className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant hover:border-cyber-blue text-on-surface-variant hover:text-cyber-blue flex items-center justify-center transition-all hover:scale-110 active:scale-95" href="https://facebook.com" rel="noopener noreferrer" target="_blank" title="Facebook">
<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
</svg>
</a>
{/* Instagram */}
<a className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant hover:border-rose-400 text-on-surface-variant hover:text-rose-400 flex items-center justify-center transition-all hover:scale-110 active:scale-95" href="https://instagram.com" rel="noopener noreferrer" target="_blank" title="Instagram">
<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
</svg>
</a>
{/* GitHub */}
<a className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant hover:border-cyber-cyan text-on-surface-variant hover:text-cyber-cyan flex items-center justify-center transition-all hover:scale-110 active:scale-95" href="https://github.com/Procax?tab=repositories" rel="noopener noreferrer" target="_blank" title="GitHub">
<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
<path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
</svg>
</a>
</div>
{/* Telemetry status */}
<div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
<span>LATENCY: 18ms // NODE_READY</span>
</div>
</div>
</footer>
{/* ==================== DYNAMIC CYBER-TECH MOTION CONTROLLER ==================== */}


    </SoundProvider>
  );
}
