const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');
content = content.replace(
  /\) :\ \(\n\s*\) : pendingInteractiveQuiz \? \(/,
  ") : pendingInteractiveQuiz ? ("
);
fs.writeFileSync('src/components/Setup.tsx', content);
