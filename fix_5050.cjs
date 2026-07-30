const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');
content = content.replace(
  'const toEliminate = incorrectIndices.slice(0, Math.floor(incorrectIndices.length / 2));',
  'const toEliminate = incorrectIndices.slice(0, Math.max(1, incorrectIndices.length - 1));'
);
fs.writeFileSync('src/components/Presentation.tsx', content);
