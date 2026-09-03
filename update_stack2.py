import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

stack_items = ["React.js", "TypeScript", "Node.js", "TailwindCSS", "Next.js", "Framer Motion", "WebGL", "GraphQL"]
for item in stack_items:
    content = re.sub(
        r'>' + re.escape(item) + r'</span>',
        r'><DecodeText text="' + item + '" /></span>',
        content
    )

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
