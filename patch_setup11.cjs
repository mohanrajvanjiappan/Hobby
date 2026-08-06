const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

code = code.replace(
  /const assumedType = firstType || quizType || 'multiple-choice';/g,
  `let assumedType = firstType || quizType || 'multiple-choice';
    if (firstTitle.toLowerCase().includes('rapid') || firstTopic.toLowerCase().includes('rapid')) {
      assumedType = 'rapid-fire';
    }
    if (jsonItemsCloned.some(item => item.title && item.title.toLowerCase().includes('rapid'))) {
      assumedType = 'rapid-fire';
    }`
);

fs.writeFileSync('src/components/Setup.tsx', code);
