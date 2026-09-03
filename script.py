import re

with open('stitch_index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract body content
body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
else:
    body_content = html

# Basic HTML to JSX conversions
jsx = body_content
jsx = jsx.replace('class=', 'className=')
jsx = jsx.replace('for=', 'htmlFor=')
jsx = jsx.replace('tabindex=', 'tabIndex=')
jsx = jsx.replace('stroke-linecap=', 'strokeLinecap=')
jsx = jsx.replace('stroke-linejoin=', 'strokeLinejoin=')
jsx = jsx.replace('stroke-width=', 'strokeWidth=')
jsx = jsx.replace('fill-rule=', 'fillRule=')
jsx = jsx.replace('clip-rule=', 'clipRule=')
jsx = jsx.replace('<!--', '{/*')
jsx = jsx.replace('-->', '*/}')
jsx = re.sub(r'<img([^>]+)>(?!\s*</img)', r'<img\1 />', jsx)
jsx = re.sub(r'<input([^>]+)>(?!\s*</input)', r'<input\1 />', jsx)
jsx = re.sub(r'<br([^>]+)>(?!\s*</br)', r'<br\1 />', jsx)
jsx = re.sub(r'<br>', r'<br />', jsx)
jsx = re.sub(r'<hr([^>]+)>(?!\s*</hr)', r'<hr\1 />', jsx)
jsx = re.sub(r'<hr>', r'<hr />', jsx)
jsx = jsx.replace('style=\"animation-duration: 4s;\"', 'style={{ animationDuration: \"4s\" }}')
jsx = jsx.replace('style=\"animation-duration: 12s;\"', 'style={{ animationDuration: \"12s\" }}')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write('import React from \"react\";\nimport \"./index.css\";\n\nexport default function App() {\n  return (\n    <>\n')
    f.write(jsx)
    f.write('\n    </>\n  );\n}\n')

# Extract styles
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
if style_match:
    style_content = style_match.group(1)
    with open('src/index.css', 'w', encoding='utf-8') as f:
        f.write('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n')
        f.write(style_content)

print("Conversion complete.")
