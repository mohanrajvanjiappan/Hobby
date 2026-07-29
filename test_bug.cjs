const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(
  "setCurrentPlayerIndex(p => (p + 1) % (quiz.players?.length || 1));",
  "setCurrentPlayerIndex(p => { console.log('Updating player index. Prev:', p, 'Next:', (p + 1) % (quiz.players?.length || 1), 'Total Players:', quiz.players?.length); return (p + 1) % (quiz.players?.length || 1); });"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
