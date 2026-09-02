const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(/<div\n\s*<svg width="0" height="0" className="hidden absolute">/, '<div>\n      <svg width="0" height="0" className="hidden absolute">');

code = code.replace(/const getBlurStyle = \(\) => \{[\s\S]*?\};\s*const getBlurStyle = \(\) => \{[\s\S]*?\};/, 'const getBlurStyle = () => { /* duplicated */ };'); // Wait, why is it already declared?

fs.writeFileSync('src/components/Presentation.tsx', code);
