import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix href="#"
content = content.replace('href="#"', 'href="#!"')

# Find all lines with comments inside JSX that might be missing braces
lines = content.split('\n')
for i, line in enumerate(lines):
    # If a line starts with // or /* but is inside JSX (which it likely is if it has HTML tags around it)
    if ' //' in line and '<' in line:
        print(f"Line {i+1}: {line}")

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
