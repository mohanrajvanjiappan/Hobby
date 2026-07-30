const fs = require('fs');
const content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');
const searchPoint = `setInteractiveOptionClicked(null);`;
fs.writeFileSync('src/components/Presentation.tsx', content.replace(
  searchPoint,
  `setInteractiveOptionClicked(null);\n    setEliminatedOptions([]);`
));
