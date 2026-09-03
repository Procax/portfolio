with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

part = content[content.find('<XRayCard className="reveal-on-scroll" style={{ transitionDelay: "200ms" }}>'):content.find('</XRayCard></div>')+11]
with open('part.jsx', 'w', encoding='utf-8') as f:
    f.write('export default function Test() { return (<>' + part + '</>); }')
