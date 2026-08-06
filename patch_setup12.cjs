const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /if \(quiz\.type === 'rapid-fire'\) setStage\('category-selection'\);\n\s*else setStage\('question-selection'\);/g,
  `if (quiz.type === 'rapid-fire' || (quiz.title && quiz.title.toLowerCase().includes('rapid'))) setStage('category-selection');
            else setStage('question-selection');`
);

fs.writeFileSync('src/components/Presentation.tsx', code);
