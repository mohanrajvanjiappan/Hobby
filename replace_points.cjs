const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

// replace the actual score addition
content = content.replace(/quiz\.mode === 'interactive' && quiz\.isMultiplayer \? 10 : 1/g, 'getAwardPoints()');

// However, for scorePerQuestion, we want the max possible score for 5-clues interactive
content = content.replace(
  'const scorePerQuestion = getAwardPoints();',
  'const scorePerQuestion = (quiz.mode === \'interactive\' && quiz.type === \'5-clues\') ? 10 : (quiz.mode === \'interactive\' && quiz.isMultiplayer ? 10 : 1);'
);

// We need to also replace the `setScore(s => s + (quiz.isMultiplayer ? 10 : 1))` which is around jumbled letters? No, jumbled letters is not 5-clues. But jumbled letters had `quiz.isMultiplayer ? 10 : 1`. Let's check it.
fs.writeFileSync('src/components/Presentation.tsx', content);
