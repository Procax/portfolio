import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('viewbox=', 'viewBox=')
content = content.replace('onclick=', 'onClick=')
content = content.replace('onsubmit=', 'onSubmit=')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
