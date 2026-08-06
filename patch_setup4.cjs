const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

code = code.replace(
  /type: \(firstType as any\) \|\| "multiple-choice",/g,
  `type: (assumedType as any),`
);

fs.writeFileSync('src/components/Setup.tsx', code);
