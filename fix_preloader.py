import re

with open('src/components/Preloader.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = "const Preloader = ({ onComplete }) => {\n  const [lines, setLines] = useState([]);\n  \n  const bootSequence = ["
replacement = "const bootSequence = [\n"
content = content.replace(target, replacement)

# Now find where the array ends (which is "];") and insert the component start
content = content.replace('  ];', '];\n\nconst Preloader = ({ onComplete }) => {\n  const [lines, setLines] = useState([]);', 1)

# Remove bootSequence from dependency array to be totally safe
content = content.replace('[bootSequence, onComplete]', '[onComplete]')

with open('src/components/Preloader.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
