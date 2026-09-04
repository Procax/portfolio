import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import motion hooks
content = content.replace(
    'import { SoundProvider, SoundToggle } from "./components/SoundEngine";',
    'import { SoundProvider, SoundToggle } from "./components/SoundEngine";\nimport { motion, useScroll, useTransform } from "framer-motion";'
)

# 2. Add hooks to App component
target = '  const [booting, setBooting] = useState(true);\n\n  useEffect(() => {'
replacement = '''  const [booting, setBooting] = useState(true);

  // Dynamic Depth of Field (Scroll Blur)
  const { scrollYProgress } = useScroll();
  const backgroundBlur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], ["blur(0px)", "blur(12px)", "blur(12px)", "blur(4px)"]);

  useEffect(() => {'''
content = content.replace(target, replacement)

# 3. Wrap the background elements in the motion.div
target_bg = '''      <SoundProvider>
        <SoundToggle />
        <CursorTrail />
        <CircuitScrollLine />
        <KineticMarquee text="FRONT-END ENGINEER ? UI/UX ? CYBER-TECH " />
        <div className="crt-overlay pointer-events-none fixed inset-0 z-50"></div>
        <ParticlesBG />'''

replacement_bg = '''      <SoundProvider>
        <SoundToggle />
        <CursorTrail />
        <div className="crt-overlay pointer-events-none fixed inset-0 z-50"></div>
        
        {/* Dynamic Depth of Field Background Layer */}
        <motion.div style={{ filter: backgroundBlur }} className="fixed inset-0 z-0 pointer-events-none">
          <CircuitScrollLine />
          <KineticMarquee text="FRONT-END ENGINEER • UI/UX • CYBER-TECH " />
          <ParticlesBG />
        </motion.div>'''

# Because there is a unicode encoding issue in python strings here ? which is actually •, 
# I will just regex replace the specific parts.
