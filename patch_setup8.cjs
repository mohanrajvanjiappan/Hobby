const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /export default function Presentation\(\{ quiz, onExit \}: PresentationProps\) \{/g,
  `export default function Presentation({ quiz, onExit }: PresentationProps) {
  console.log("QUIZ TYPE IS:", quiz.type, "AND STAGE IS:", stage);`
);

fs.writeFileSync('src/components/Presentation.tsx', code);
