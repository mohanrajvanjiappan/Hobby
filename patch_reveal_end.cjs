const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(
  "if (quiz.mode === 'interactive' && interactiveOptionClicked) {",
  "if (quiz.mode === 'interactive' && interactiveOptionClicked !== null) {"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
