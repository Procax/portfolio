import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import motion hooks
if 'useScroll' not in content:
    content = content.replace(
        'import { SoundProvider, SoundToggle } from "./components/SoundEngine";',
        'import { SoundProvider, SoundToggle } from "./components/SoundEngine";\nimport { motion, useScroll, useTransform } from "framer-motion";'
    )

# 2. Add hooks to App component
if 'backgroundBlur' not in content:
    target = '  const [booting, setBooting] = useState(true);\n\n  useEffect(() => {'
    replacement = '''  const [booting, setBooting] = useState(true);

  // Dynamic Depth of Field (Scroll Blur)
  const { scrollYProgress } = useScroll();
  const backgroundBlur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], ["blur(0px)", "blur(12px)", "blur(12px)", "blur(4px)"]);

  useEffect(() => {'''
    content = content.replace(target, replacement)

# 3. Replace the background rendering
content = re.sub(
    r'<KineticMarquee text="([^"]+)" />\s*<div className="crt-overlay pointer-events-none fixed inset-0 z-50"></div>\s*<ParticlesBG />',
    r'''<div className="crt-overlay pointer-events-none fixed inset-0 z-50"></div>
        <motion.div style={{ filter: backgroundBlur }} className="fixed inset-0 z-0 pointer-events-none">
          <KineticMarquee text="\1" />
          <ParticlesBG />
        </motion.div>''',
    content
)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
