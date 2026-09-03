import re

with open('src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if script_match:
    js_code = script_match.group(1)
    
    js_code = js_code.replace("document.addEventListener('DOMContentLoaded', () => {", "")
    js_code = js_code.rsplit('});', 1)[0]
    
    content = re.sub(r'<script>.*?</script>', '', content, flags=re.DOTALL)
    
    import_hook = 'import React, { useEffect } from "react";'
    content = content.replace('import React from "react";', import_hook)
    
    app_decl = 'export default function App() {'
    new_app_decl = app_decl + '\n  useEffect(() => {' + js_code + '  }, []);\n'
    content = content.replace(app_decl, new_app_decl)
    
    with open('src/App.js', 'w', encoding='utf-8') as f:
        f.write(content)
