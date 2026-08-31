const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace exact strings safely.
code = code.replace(/quizType !== 'identify-image'/g, "quizType !== 'identify-image' && quizType !== 'blurred-image'");
code = code.replace(/quizType === 'identify-image'/g, "(quizType === 'identify-image' || quizType === 'blurred-image')");

fs.writeFileSync('server.ts', code);
console.log("Done server patch");
