import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    jsx = f.read()

jsx = re.sub(r'src="https://lh3.googleusercontent.com[^"]+"', 'src="/profile.jpg"', jsx)
jsx = re.sub(r'onError=\{\(e\) => \{ e\.target\.onerror = null; \}\}\s*', '', jsx)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(jsx)
