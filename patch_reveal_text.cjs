const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(
  "+1 {playersState[currentPlayerIndex]?.name}",
  "+{quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1} {playersState[currentPlayerIndex]?.name}"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched reveal text!");
