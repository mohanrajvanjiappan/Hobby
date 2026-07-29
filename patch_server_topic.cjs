const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const target1 = `const { topic, numQuestions, difficulty, quizType = 'multiple-choice', customItems } = req.body;`;
const replace1 = `let { topic, numQuestions, difficulty, quizType = 'multiple-choice', customItems } = req.body;
      if (!topic || !topic.trim()) {
        topic = 'Item';
      }`;

content = content.replace(target1, replace1);
fs.writeFileSync('server.ts', content);
console.log("Patched server topic");
