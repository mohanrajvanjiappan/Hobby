const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Replace the transition logic inside text-presentation interval
content = content.replace(/if \(quiz\.mode === 'interactive'\) setStage\('score'\);\s*else setStage\('outro'\);/g, "setStage('outro');");

fs.writeFileSync('src/components/Presentation.tsx', content);
