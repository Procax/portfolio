import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace('import React, { useEffect } from "react";', 
    'import React, { useEffect, useState } from "react";\n' +
    'import Preloader from "./components/Preloader";\n' +
    'import ParticlesBG from "./components/ParticlesBG";\n' +
    'import MagneticElement from "./components/MagneticElement";\n' +
    'import DecodeText from "./components/DecodeText";\n'
)

# 2. Add booting state
content = content.replace('export default function App() {\n', 
    'export default function App() {\n  const [booting, setBooting] = useState(true);\n'
)

# 3. Handle return statement for booting and injecting Particles and CRT
return_replacement = """  if (booting) {
    return <Preloader onComplete={() => setBooting(false)} />;
  }

  return (
    <>
      <div className="crt-overlay"></div>
      <ParticlesBG />
"""
content = content.replace('  return (\n    <>\n', return_replacement)

# 4. Wrap all "View Selected Work" and social icons in MagneticElement
# For social icons (facebook, instagram, github)
content = re.sub(
    r'(<a[^>]+title="Facebook"[^>]*>.*?</a>)', 
    r'<MagneticElement>\1</MagneticElement>', 
    content, flags=re.DOTALL
)
content = re.sub(
    r'(<a[^>]+title="Instagram"[^>]*>.*?</a>)', 
    r'<MagneticElement>\1</MagneticElement>', 
    content, flags=re.DOTALL
)
content = re.sub(
    r'(<a[^>]+title="GitHub"[^>]*>.*?</a>)', 
    r'<MagneticElement>\1</MagneticElement>', 
    content, flags=re.DOTALL
)
content = re.sub(
    r'(<a[^>]+title="GitHub Profile"[^>]*>.*?</a>)', 
    r'<MagneticElement>\1</MagneticElement>', 
    content, flags=re.DOTALL
)

# Wrap 'View Selected Work' button
content = re.sub(
    r'(<a[^>]+href="#work"[^>]*>.*?<span>View Selected Work</span>.*?</a>)', 
    r'<MagneticElement>\1</MagneticElement>', 
    content, flags=re.DOTALL
)

# Wrap 'Contact Me' button
content = re.sub(
    r'(<a[^>]+href="#contact"[^>]*>.*?<span>Contact Me</span>.*?</a>)', 
    r'<MagneticElement>\1</MagneticElement>', 
    content, flags=re.DOTALL
)

# 5. Add Glitch text to H2 Headers
content = re.sub(
    r'<h2 className="([^"]+)">(.*?)</h2>',
    r'<h2 className="\1 glitch-hover" data-text="\2">\2</h2>',
    content
)

# 6. Add DecodeText to Core Stack items
stack_items = ["React.js", "TypeScript", "Node.js", "TailwindCSS", "Next.js", "Framer Motion", "WebGL", "GraphQL"]
for item in stack_items:
    content = content.replace(f'<span>{item}</span>', f'<DecodeText text="{item}" />')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
