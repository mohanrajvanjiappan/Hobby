const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(
  /const numAnswered = \(quiz\.isMultiplayer && quiz\.mode === 'interactive' && quiz\.type !== 'combat-mode'\)/g,
  "const numAnswered = (quiz.mode === 'interactive' && quiz.type !== 'combat-mode')"
);

content = content.replace(
  /if \(quiz\.isMultiplayer && quiz\.mode === 'interactive' && quiz\.type !== 'combat-mode'\) {\\n             setStage\('question-selection'\);/g,
  "if (quiz.mode === 'interactive' && quiz.type !== 'combat-mode') {\\n             if (categories.length > 1) {\\n               const categoryQuestions = quiz.questions.map((q, i) => ({q, i})).filter(x => x.q.category === selectedCategory);\\n               if (categoryQuestions.every(x => answeredQuestions.has(x.i))) {\\n                 setStage('category-selection');\\n               } else {\\n                 setStage('question-selection');\\n               }\\n             } else {\\n               setStage('question-selection');\\n             }"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched grid 2!");
