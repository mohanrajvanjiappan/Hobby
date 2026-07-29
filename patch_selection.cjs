const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /setSelectedQuestionIndex\(idx\);\s*/;
content = content.replace(regex, '');

fs.writeFileSync('src/components/Presentation.tsx', content);
