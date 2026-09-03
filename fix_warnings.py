import re

# Fix CursorTrail
with open('src/components/CursorTrail.jsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('let isMoving = false;', '')
content = content.replace('isMoving = true;', '')
content = content.replace('timeout = setTimeout(() => (isMoving = false), 100);', 'timeout = setTimeout(() => {}, 100);')
with open('src/components/CursorTrail.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Fix CyberCore3D
with open('src/components/CyberCore3D.jsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('import { Float, Wireframe } from \'@react-three/drei\';', 'import { Float } from \'@react-three/drei\';')
with open('src/components/CyberCore3D.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Fix Preloader
with open('src/components/Preloader.jsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('  }, []);', '  }, [bootSequence, onComplete]);')
with open('src/components/Preloader.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
