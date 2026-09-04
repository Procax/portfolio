import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef(null);
  const ambientOscRef = useRef(null);
  const ambientGainRef = useRef(null);
  const lfoRef = useRef(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      document.removeEventListener('click', initAudio);
    };
    document.addEventListener('click', initAudio);
    return () => document.removeEventListener('click', initAudio);
  }, []);

  // Manage Ambient Drone
  useEffect(() => {
    if (isMuted) {
      // Fade out and stop ambient drone
      if (ambientGainRef.current && audioCtxRef.current) {
        ambientGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setTimeout(() => {
          if (ambientOscRef.current) {
            try { ambientOscRef.current.stop(); } catch(e) {}
            ambientOscRef.current = null;
          }
          if (lfoRef.current) {
            try { lfoRef.current.stop(); } catch(e) {}
            lfoRef.current = null;
          }
        }, 1000);
      }
    } else {
      // Start ambient drone
      if (audioCtxRef.current) {
        // Deep low frequency oscillator
        const osc = audioCtxRef.current.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 55; // 55Hz Low Hum

        // Filter to muffle it into a deep drone
        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 150;

        // LFO to slowly modulate the filter for a "breathing" engine effect
        const lfo = audioCtxRef.current.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1; // 10 seconds per cycle

        const lfoGain = audioCtxRef.current.createGain();
        lfoGain.gain.value = 50; // modulate filter frequency by 50Hz

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.value = 0; // start at 0 and fade in
        gainNode.gain.setTargetAtTime(0.08, audioCtxRef.current.currentTime, 2); // max volume 0.08

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);

        osc.start();
        lfo.start();

        ambientOscRef.current = osc;
        lfoRef.current = lfo;
        ambientGainRef.current = gainNode;
      }
    }
  }, [isMuted]);

  const playClick = () => {
    if (isMuted || !audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtxRef.current.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioCtxRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.1);
  };

  const playHover = () => {
    if (isMuted || !audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, audioCtxRef.current.currentTime);
    osc.frequency.linearRampToValueAtTime(400, audioCtxRef.current.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioCtxRef.current.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.1);
  };

  return (
    <SoundContext.Provider value={{ isMuted, setIsMuted, playClick, playHover }}>
      {children}
    </SoundContext.Provider>
  );
};

export const SoundToggle = () => {
  const { isMuted, setIsMuted, playClick } = useSound();
  
  return (
    <button
      onClick={() => {
        setIsMuted(!isMuted);
        if (isMuted) playClick();
      }}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-surface-container-high border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan hover:border-cyber-cyan transition-all hover:scale-110 shadow-[0_0_15px_rgba(0,242,254,0.15)]"
      title={isMuted ? "Unmute Audio" : "Mute Audio"}
    >
      <span className="material-symbols-outlined text-[20px]">
        {isMuted ? 'volume_off' : 'volume_up'}
      </span>
    </button>
  );
};
