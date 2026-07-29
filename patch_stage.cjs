const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const target1 = `type Stage = 'intro' | 'multiplayer-intro' | 'warmup' | 'countdown' | 'question-selection' | 'question' | 'reveal' | 'quote' | 'score' | 'badges' | 'talk' | 'outro' | 'video-badges';`;
const replace1 = `type Stage = 'intro' | 'multiplayer-intro' | 'warmup' | 'countdown' | 'category-selection' | 'question-selection' | 'question' | 'reveal' | 'quote' | 'score' | 'badges' | 'talk' | 'outro' | 'video-badges';`;

content = content.replace(target1, replace1);
fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched Stage type!");
