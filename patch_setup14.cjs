const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /if \(quiz\.type !== 'rapid-fire'\) \{\n\s*timerRef\.current = setInterval/g,
  `
        timerRef.current = setInterval`
);

fs.writeFileSync('src/components/Presentation.tsx', code);
