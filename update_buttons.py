import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = '''<a className="btn-cyber-primary inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-cyan text-surface-dim font-mono text-sm font-bold glow-cyan hover:shadow-[0_0_32px_rgba(0,242,254,0.6)] hover:scale-[1.03] transition-all" href="#work">
<span>View Selected Work</span>
<span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">terminal</span>
</a>'''

repl1 = '''<MagneticElement><a className="btn-cyber-primary inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-cyan text-surface-dim font-mono text-sm font-bold glow-cyan hover:shadow-[0_0_32px_rgba(0,242,254,0.6)] hover:scale-[1.03] transition-all" href="#work">
<span>View Selected Work</span>
<span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">terminal</span>
</a></MagneticElement>'''

target2 = '''<a className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant hover:border-cyber-cyan/50 text-white font-mono text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]" href="#contact">
<span className="material-symbols-outlined text-[18px] text-cyber-cyan">mail</span>
<span>Contact Me</span>
</a>'''

repl2 = '''<MagneticElement><a className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant hover:border-cyber-cyan/50 text-white font-mono text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]" href="#contact">
<span className="material-symbols-outlined text-[18px] text-cyber-cyan">mail</span>
<span>Contact Me</span>
</a></MagneticElement>'''

content = content.replace(target1, repl1)
content = content.replace(target2, repl2)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)
