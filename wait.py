import re

with open('src/components/Preloader.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will wrap the bootSequence array in a useMemo.
target = "const bootSequence = ["
replacement = "const bootSequence = React.useMemo(() => ["
content = content.replace(target, replacement)

target2 = "  ];"
replacement2 = "  ], []);"
# Because there are other arrays, I should be careful. I will just use regex to insert useMemo
