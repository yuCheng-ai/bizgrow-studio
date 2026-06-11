const fs = require('fs');
const path = require('path');

const cleanIcons = () => {
  const dir = './src/components';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  files.push('../App.tsx');

  files.forEach(f => {
    const p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    
    // Quick pass to find all standard imports that are unused (cheap regex approximation)
    // Only looking at lucide-react specifically.
    const match = c.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/);
    if(match) {
      const imports = match[1].split(',').map(i => i.trim()).filter(Boolean);
      const used = imports.filter(i => {
        const uses = Array.from(c.matchAll(new RegExp(`\\b${i}\\b`, 'g')));
        // If it's used more than once (once being the import itself)
        return uses.length > 1;
      });
      
      const diff = imports.length - used.length;
      if(diff > 0) {
        console.log(f, 'unused icons:', imports.filter(i => !used.includes(i)));
        const newImport = used.length > 0 ? `import { ${used.join(', ')} } from 'lucide-react'` : '';
        c = c.replace(match[0], newImport);
        fs.writeFileSync(p, c);
      }
    }
  });
};

cleanIcons();
