import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
new_imports = """import { SoundProvider, SoundToggle } from "./components/SoundEngine";
import CyberCore3D from "./components/CyberCore3D";
import KineticMarquee from "./components/KineticMarquee";
import CircuitScrollLine from "./components/CircuitScrollLine";
import XRayCard from "./components/XRayCard";
import CursorTrail from "./components/CursorTrail";
"""
content = content.replace('import DecodeText from "./components/DecodeText";\n', 'import DecodeText from "./components/DecodeText";\n' + new_imports)

# 2. Add Provider to Return
target_return = """  return (
    <>"""
replacement_return = """  return (
    <SoundProvider>
      <SoundToggle />
      <CursorTrail />
      <CircuitScrollLine />
      <KineticMarquee text="FRONT-END ENGINEER • UI/UX • CYBER-TECH " />"""
content = content.replace(target_return, replacement_return)

target_end = """    </>
  );
}"""
replacement_end = """    </SoundProvider>
  );
}"""
content = content.replace(target_end, replacement_end)

# 3. Add CyberCore3D to Hero
target_hero = '<div className="tilt-card relative w-full h-full rounded-2xl overflow-hidden bg-surface-container border border-cyber-cyan/40 p-2 glow-blue flex flex-col cursor-crosshair" id="hero-portrait-card">'
replacement_hero = target_hero + '\n<CyberCore3D />'
content = content.replace(target_hero, replacement_hero)

# 4. Wrap Project Cards in XRayCard
# Project 1
p1_target = '<article className="project-card reveal-on-scroll group rounded-2xl bg-surface-container/70 border border-outline-variant hover:border-cyber-cyan/80 overflow-hidden backdrop-blur-md transition-all duration-500 flex flex-col justify-between" style={{ transitionDelay: "100ms" }}>'
p1_repl = '<XRayCard className="reveal-on-scroll" style={{ transitionDelay: "100ms" }}>\n<article className="project-card group rounded-2xl bg-surface-container/70 border border-outline-variant hover:border-cyber-cyan/80 overflow-hidden backdrop-blur-md transition-all duration-500 flex flex-col justify-between h-full">'
content = content.replace(p1_target, p1_repl)

# Project 2
p2_target = '<article className="project-card reveal-on-scroll group rounded-2xl bg-surface-container/70 border border-outline-variant hover:border-cyber-blue/80 overflow-hidden backdrop-blur-md transition-all duration-500 flex flex-col justify-between" style={{ transitionDelay: "200ms" }}>'
p2_repl = '<XRayCard className="reveal-on-scroll" style={{ transitionDelay: "200ms" }}>\n<article className="project-card group rounded-2xl bg-surface-container/70 border border-outline-variant hover:border-cyber-blue/80 overflow-hidden backdrop-blur-md transition-all duration-500 flex flex-col justify-between h-full">'
content = content.replace(p2_target, p2_repl)

# Close XRayCard tags
# Finding the closing </article> for project cards.
content = re.sub(r'(</article>)\s*(?=<!-- PROJECT 2:)', r'\1\n</XRayCard>', content)
content = re.sub(r'(</article>)\s*(?=</div>\s*</section>)', r'\1\n</XRayCard>', content)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
