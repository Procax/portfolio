import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<span>// 01. PROFILE_LOG</span>', '<span>{"// 01. PROFILE_LOG"}</span>')
content = content.replace('<span>// 02. SYSTEM_TOOLKIT</span>', '<span>{"// 02. SYSTEM_TOOLKIT"}</span>')
content = content.replace('<span>// 03. SHIPPED_BUILDS</span>', '<span>{"// 03. SHIPPED_BUILDS"}</span>')
content = content.replace('<span>// 04. TRANSMISSION_PORT</span>', '<span>{"// 04. TRANSMISSION_PORT"}</span>')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
