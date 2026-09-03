import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    jsx = f.read()

jsx = jsx.replace('style="left: -999px; top: -999px;"', 'style={{ left: "-999px", top: "-999px" }}')

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(jsx)
