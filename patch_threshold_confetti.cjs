const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldStr = `const nextScore = s + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
                                if (nextScore >= (quiz.questions.length / 2) * (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1)) {
                                  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                                }`;
const newStr = `const inc = (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
                                const nextScore = s + inc;
                                const threshold = Math.ceil(quiz.questions.length / 2) * inc;
                                if (s < threshold && nextScore >= threshold) {
                                  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                                }`;

content = content.replace(oldStr, newStr);

const oldStr2 = `const nextScore = s + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
                              if (nextScore >= (quiz.questions.length / 2) * (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1)) {
                                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                              }`;
                              
const newStr2 = `const inc = (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
                              const nextScore = s + inc;
                              const threshold = Math.ceil(quiz.questions.length / 2) * inc;
                              if (s < threshold && nextScore >= threshold) {
                                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                              }`;

content = content.replace(oldStr2, newStr2);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched threshold confetti!");
