const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace quizType === 'identify-image' with (quizType === 'identify-image' || quizType === 'blurred-image')
code = code.replace(/quizType === 'identify-image'/g, "(quizType === 'identify-image' || quizType === 'blurred-image')");

// Also there is a check `quizType !== 'detective' && quizType !== 'jumbled-letters' && quizType !== 'match-the-following' && quizType !== 'combat-mode' && (quizType === 'identify-image' || quizType === 'blurred-image') && quizType !== 'a-to-z'`
// Wait, the regex replace will result in:
// `if (quizType !== 'detective' && quizType !== 'jumbled-letters' && quizType !== 'match-the-following' && quizType !== 'combat-mode' && (quizType === 'identify-image' || quizType === 'blurred-image') && quizType !== 'a-to-z') {`
// Wait, the original was `quizType !== 'identify-image'`.
// Let's check line 548 of server.ts.
