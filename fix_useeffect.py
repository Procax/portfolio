import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace useEffect(() => { with useEffect(() => { if (!booting) {
target_start = '  useEffect(() => {\n  \n    // 1. Dynamic Cursor Radial Glow Follower'
replacement_start = '  useEffect(() => {\n    if (booting) return;\n\n    // 1. Dynamic Cursor Radial Glow Follower'
content = content.replace(target_start, replacement_start)

# Change the dependency array from [] to [booting]
target_end = '    }\n    }, []);'
replacement_end = '    }\n  }, [booting]);'
content = content.replace(target_end, replacement_end)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
