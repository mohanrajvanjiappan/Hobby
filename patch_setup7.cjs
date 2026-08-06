const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

code = code.replace(
  /type: \(assumedType as any\),/g,
  `type: ((firstType || quizType || "multiple-choice") as any),`
);

fs.writeFileSync('src/components/Setup.tsx', code);
