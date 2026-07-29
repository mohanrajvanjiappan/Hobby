const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');
content = content.replace(
  "type Stage = 'intro' | 'warmup' | 'question' | 'reveal' | 'quote' | 'outro';",
  "type Stage = 'intro' | 'warmup' | 'countdown' | 'question' | 'reveal' | 'quote' | 'outro';"
);
fs.writeFileSync('src/components/Presentation.tsx', content);
