const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldStr = "text-yellow-500' : 'bg-white/30 text-white'}`}>\n                        {idx + 1}";
const newStr = "text-yellow-500' : 'bg-white/30 text-white'}`}>\n                        {playersState.length - idx}";

content = content.replace(oldStr, newStr);

fs.writeFileSync('src/components/Presentation.tsx', content);
