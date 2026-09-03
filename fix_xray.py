import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix missing closing tag for the first XRayCard
content = re.sub(
    r'(</article>)\s*(\{\/\* PROJECT 2:)',
    r'\1\n</XRayCard>\n\2',
    content
)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
