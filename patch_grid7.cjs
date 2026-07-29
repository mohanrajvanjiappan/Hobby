const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const target1 = `if (categoryQuestions.length > 0 && categoryQuestions.every(x => answeredQuestions.has(x.i))) {`;
const replace1 = `if (categoryQuestions.length > 0 && categoryQuestions.every(x => answeredQuestions.has(x.i) || x.i === currentQuestionIndex)) {`;
content = content.replace(target1, replace1);

const target2 = `if (categoryQuestions.length > 0 && categoryQuestions.every(x => answeredQuestions.has(x.i))) {`;
// There are two occurrences of this (line 526 and 678). Let's use global replace.
content = content.replace(/if \(categoryQuestions\.length > 0 && categoryQuestions\.every\(x => answeredQuestions\.has\(x\.i\)\)\) \{/g, replace1);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched category answered logic!");
