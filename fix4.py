import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    jsx = f.read()

jsx = re.sub(r'style="transition-delay:\s*(\d+)ms;?"', r'style={{ transitionDelay: "\1ms" }}', jsx)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(jsx)
