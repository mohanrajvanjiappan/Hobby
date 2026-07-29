const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(
  /w-\[80vw\]/g,
  "w-[75vw]"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
