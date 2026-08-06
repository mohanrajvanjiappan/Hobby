const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const replacement = `let assumedType = firstType || quizType || 'multiple-choice';
    if (firstTitle.toLowerCase().includes('rapid') || firstTopic.toLowerCase().includes('rapid')) {
      assumedType = 'rapid-fire';
    }
    if (jsonItemsCloned.some(item => item.title && item.title.toLowerCase().includes('rapid'))) {
      assumedType = 'rapid-fire';
    }`;

const parts = code.split(replacement);
let restored = parts.join('');

fs.writeFileSync('src/components/Setup.tsx.restored', restored);
