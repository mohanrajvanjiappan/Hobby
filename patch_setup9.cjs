const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /const \[stage, setStage\] = useState<Stage>\('intro'\);/g,
  `const [stage, setStage] = useState<Stage>('intro');
  console.log("QUIZ TYPE IS:", quiz.type, "AND STAGE IS:", stage);`
);

fs.writeFileSync('src/components/Presentation.tsx', code);
