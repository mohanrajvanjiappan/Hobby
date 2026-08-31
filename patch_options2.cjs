const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

code = code.replace(
  /animate=\{isReveal && isCorrect \? \{ scale: \[1, 1\.05, 1\] \} : \{\}\}\n\s*transition=\{isReveal && isCorrect \? \{ repeat: Infinity, duration: 1\.5 \} : \{\}\}/,
  ""
);

fs.writeFileSync('src/components/Presentation.tsx', code);
