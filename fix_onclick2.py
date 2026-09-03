import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = 'onClick="navigator.clipboard.writeText(\'npx karansingh-hajari --portfolio\'); this.innerText=\'COPIED!\'; setTimeout(() =&gt; this.innerText=\'COPY\', 2000);"'
replacement = 'onClick={(e) => { navigator.clipboard.writeText(\'npx karansingh-hajari --portfolio\'); const btn = e.target; btn.innerText=\'COPIED!\'; setTimeout(() => btn.innerText=\'COPY\', 2000); }}'

content = content.replace(target, replacement)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
