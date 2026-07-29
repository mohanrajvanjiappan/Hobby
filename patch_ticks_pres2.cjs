const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(/if \(quiz\.mode !== 'interactive' \|\| prev <= 6\) audioSynth\.playTick\(\);/g, 
  "if (quiz.type !== 'text-presentation' && (quiz.mode !== 'interactive' || prev <= 6)) audioSynth.playTick();"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
