import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');
code = code.replace("setTimeLeft(question.timeLimit);", "setTimeLeft(question.timeLimit || 15);");
fs.writeFileSync('src/components/Presentation.tsx', code);
