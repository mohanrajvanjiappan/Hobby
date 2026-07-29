const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const targetStr = `base64: event.target?.result as string,
                                name: ''`;
const replaceStr = `base64: event.target?.result as string,
                                name: file.name.replace(/\\.[^/.]+$/, "").replace(/[_-]/g, " ")`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/components/Setup.tsx', content);
console.log("Patched custom images name default properly!");
