const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /if \(quiz\.mode === 'interactive'\) \{\s*setStage\('warmup'\);\s*\} else \{\s*setStage\('question'\);\s*\}/;
const replacement = `if (quiz.isMultiplayer) {
                setStage('multiplayer-intro');
              } else if (quiz.mode === 'interactive') {
                setStage('warmup');
              } else {
                setStage('question');
              }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/Presentation.tsx', content);
