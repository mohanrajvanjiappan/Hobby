const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

code = code.replace(
  ") : \\n        {setupMode === 'presentation'",
  ") : setupMode === 'presentation'"
);

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Fixed ternary");
