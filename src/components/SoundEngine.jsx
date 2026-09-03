import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // Initialize AudioContext on first user interaction
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
