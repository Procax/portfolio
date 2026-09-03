import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'<h2 className="(text-3xl[^"]+)">([^<]+)</h2>',
    r'<h2 className="\1 glitch-hover" data-text="\2">\2</h2>',
    content
)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
