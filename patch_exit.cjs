const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const target1 = `
            key="multiplayer-intro"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center p-8 max-w-7xl flex flex-col items-center justify-center h-full z-10 w-full mx-auto relative"
`;
const replacement1 = `
            key="multiplayer-intro"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0, transition: { duration: 0.3 } }}
            className="text-center p-8 max-w-7xl flex flex-col items-center justify-center h-full z-10 w-full mx-auto relative"
`;
code = code.replace(target1.trim(), replacement1.trim());

fs.writeFileSync('src/components/Presentation.tsx', code);
