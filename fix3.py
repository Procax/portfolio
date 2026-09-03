import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    jsx = f.read()

jsx = jsx.replace('style="transition-delay: 100ms;"', 'style={{ transitionDelay: "100ms" }}')
jsx = jsx.replace('style="transition-delay: 200ms;"', 'style={{ transitionDelay: "200ms" }}')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(jsx)

with open('src/index.js', 'r', encoding='utf-8-sig') as f:
    content = f.read()

with open('src/index.js', 'w', encoding='utf-8') as f:
    f.write(content)
