import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix onSubmit string to JSX function
content = content.replace(
    'onSubmit="event.preventDefault(); \nalert(\'Transmission dispatched to KaranSinghHajari.\');"',
    'onSubmit={(e) => { e.preventDefault(); alert(\'Transmission dispatched to KaranSinghHajari.\'); }}'
)
content = content.replace(
    'onSubmit="event.preventDefault(); alert(\'Transmission dispatched to KaranSinghHajari.\');"',
    'onSubmit={(e) => { e.preventDefault(); alert(\'Transmission dispatched to KaranSinghHajari.\'); }}'
)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
