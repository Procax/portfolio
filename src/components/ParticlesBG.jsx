import React, { useCallback } from 'react';
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "./ThemeContext";

const ParticlesBG = () => {
  const { activeThemeConfig } = useTheme();

  const init = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <ParticlesProvider init={init}>
        <Particles
          key={activeThemeConfig?.id || "default"}
          id="tsparticles"
          options={{
            background: {
              color: { value: "transparent" },
            },
            fpsLimit: 60,
            particles: {
              color: { value: activeThemeConfig?.colorHex || "#00f2fe" },
              links: {
                color: activeThemeConfig?.accentHex || "#38bdf8",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: true,
                speed: 0.8,
                straight: false,
              },
              number: {
                density: { enable: true, area: 800 },
                value: 40,
              },
              opacity: { value: 0.3 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
          }}
        />
      </ParticlesProvider>
    </div>
  );
};

export default ParticlesBG;
