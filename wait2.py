import re

with open('src/components/Preloader.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Instead of useMemo, I'll just move the bootSequence array OUTSIDE of the component!
# Because it's static data.
content = content.replace("const Preloader = ({ onComplete }) => {", "")
content = content.replace("const bootSequence = [", "const bootSequence = [\n")
# find end of bootSequence array, then put the component start back.
# It's easier to just use a script to find and replace.

