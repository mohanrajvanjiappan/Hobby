const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace('id?: string;', 'id?: string;\n  category?: string;');
fs.writeFileSync('src/types.ts', content);
console.log("Patched types!");
