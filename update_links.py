import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace YouTube live link
content = re.sub(
    r'<a([^>]+)href="#"([^>]*)>\s*<span>Live Showcase</span>', 
    r'<a\1href="https://yotube-clone-kappa.vercel.app/"\2>\n  <span>Live Showcase</span>', 
    content
)

# Replace Pokedex live link
content = re.sub(
    r'<a([^>]+)href="#"([^>]*)>\s*<span>Launch Pokedex</span>', 
    r'<a\1href="https://pokemon-teal-eight-81.vercel.app/pokemon"\2>\n  <span>Launch Pokedex</span>', 
    content
)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
