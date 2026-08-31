const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

code = code.replace(/\) : \s*\{setupMode === 'presentation'/g, ") : setupMode === 'presentation'");

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Fixed ternary with regex");
