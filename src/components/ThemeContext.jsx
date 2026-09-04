import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    subtitle: 'Standard Tech',
    colorHex: '#00f2fe',
    accentHex: '#38bdf8',
    icon: 'terminal',
  },
  {
    id: 'matrix',
    name: 'Matrix Protocol',
    subtitle: 'OLED Acid Green',
    colorHex: '#00ff66',
    accentHex: '#22c55e',
    icon: 'code',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    subtitle: 'Neon Yellow & Magenta',
    colorHex: '#fee715',
    accentHex: '#ff0055',
    icon: 'bolt',
  },
  {
    id: 'ghost',
    name: 'Ghost in Shell',
    subtitle: 'Deep Violet & Ice',
    colorHex: '#c084fc',
    accentHex: '#818cf8',
    icon: 'blur_on',
  },
];

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('portfolio-cyber-theme') || 'cyan';
  });

  const activeThemeConfig = THEMES.find((t) => t.id === theme) || THEMES[0];

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('portfolio-cyber-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, activeThemeConfig, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

