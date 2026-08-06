const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Replace question-selection route with category-selection if rapid-fire
code = code.replace(/} else \{\n\s*setStage\('question-selection'\);\n\s*\}/g, (match) => {
  return `} else {
            if (quiz.type === 'rapid-fire') setStage('category-selection');
            else setStage('question-selection');
          }`;
});

fs.writeFileSync('src/components/Presentation.tsx', code);
