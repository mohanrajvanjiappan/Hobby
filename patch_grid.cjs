const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Rename isInteractiveMultiplayerGrid to isInteractiveGrid
content = content.replace(/isInteractiveMultiplayerGrid/g, 'isInteractiveGrid');

// Change its definition:
// const isInteractiveGrid = quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode';
// to
// const isInteractiveGrid = quiz.mode === 'interactive' && quiz.type !== 'combat-mode';
content = content.replace(
  /const isInteractiveGrid = quiz\.isMultiplayer && quiz\.mode === 'interactive' && quiz\.type !== 'combat-mode';/g,
  "const isInteractiveGrid = quiz.mode === 'interactive' && quiz.type !== 'combat-mode';"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched isInteractiveGrid!");
