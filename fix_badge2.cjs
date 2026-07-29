const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(/className="absolute top-1\/2 left-1\/2 transform -translate-x-1\/2 -translate-y-1\/2 z-\[200\] pointer-events-none flex flex-col items-center"/, 'className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none flex flex-col items-center"');

fs.writeFileSync('src/components/Presentation.tsx', content);
