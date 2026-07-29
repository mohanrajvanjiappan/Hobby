const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(/quiz.questions.length \/ 5/g, "(quiz.questions.length || 1) / 5");
content = content.replace(/\(Math.max\(0, currentQuestionIndex\) \/ quiz.questions.length\)/g, "(Math.max(0, currentQuestionIndex) / (quiz.questions.length || 1))");
content = content.replace(/\(\(currentQuestionIndex \+ \(stage === 'reveal' \? 1 : 0\)\) \/ quiz.questions.length\)/g, "((currentQuestionIndex + (stage === 'reveal' ? 1 : 0)) / (quiz.questions.length || 1))");
content = content.replace(/\(\(i \+ 1\) \* 5 \/ quiz.questions.length\)/g, "((i + 1) * 5 / (quiz.questions.length || 1))");

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched NaN handling");
