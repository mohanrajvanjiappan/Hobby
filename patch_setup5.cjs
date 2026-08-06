const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /timerRef\.current = setInterval\(\(\) => \{\n\s*if \(isPausedRef\.current\) return;\n\s*setTimeLeft\(\(prev\) => \{\n\s*if \(prev <= 1\) \{\n\s*if \(timerRef\.current\) clearInterval\(timerRef\.current\);\n\s*if \(quiz\.type === 'rapid-fire'\) \{[\s\S]*?return prev - 1;\n\s*\}\);\n\s*\}, 1000\);/g,
  (match) => {
    return `if (quiz.type !== 'rapid-fire') {\n        ${match}\n        }`;
  }
);

fs.writeFileSync('src/components/Presentation.tsx', code);
