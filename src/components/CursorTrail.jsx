import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

const hexToRgb = (hex) => {
  const c = hex ? hex.replace('#', '') : '00f2fe';
  const num = parseInt(c, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
};

const CursorTrail = () => {
  const canvasRef = useRef(null);
  const { activeThemeConfig } = useTheme();
  const themeColorRef = useRef('0, 242, 254');

  useEffect(() => {
    if (activeThemeConfig?.colorHex) {
      themeColorRef.current = hexToRgb(activeThemeConfig.colorHex);
    }
  }, [activeThemeConfig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      particles.push({
        x: mouse.x,
        y: mouse.y,
        size: Math.random() * 2 + 1,
        life: 1,
        color: `rgba(${themeColorRef.current}, ${Math.random()})`
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        p.life -= 0.02;
        p.size -= 0.05;
        p.y -= 0.5;
        p.x += (Math.random() - 0.5) * 2;
        
        if (p.life <= 0 || p.size <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[100] pointer-events-none opacity-60 mix-blend-screen" />;
};

export default CursorTrail;
