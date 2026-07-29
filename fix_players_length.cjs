const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(/playersState\.length/g, '(quiz.players?.length || 1)');
fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched playersState.length -> quiz.players?.length || 1");
