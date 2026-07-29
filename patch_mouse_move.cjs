const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');
content = content.replace("if (quiz.isMultiplayer) { setStage('multiplayer-intro'); } else if (quiz.mode === 'interactive') {", "if (quiz.mode === 'interactive') {");
fs.writeFileSync('src/components/Presentation.tsx', content);
