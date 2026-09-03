import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    jsx = f.read()

jsx = jsx.replace('/ />', ' />')
jsx = jsx.replace('required=\"\"', 'required')
jsx = re.sub(r'onError=\"[^\"]+\"', r'onError={(e) => { e.target.onerror = null; }}', jsx)
jsx = re.sub(r'onerror=\"[^\"]+\"', r'onError={(e) => { e.target.onerror = null; }}', jsx)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(jsx)
