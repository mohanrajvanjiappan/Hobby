const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const targetStr = `setScore(s => s + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1));`;
const replaceStr = `setScore(s => {
                              const inc = (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
                              const nextScore = s + inc;
                              const threshold = Math.ceil(quiz.questions.length / 2) * inc;
                              if (s < threshold && nextScore >= threshold) {
                                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                              }
                              return nextScore;
                            });`;

content = content.replace(new RegExp(targetStr.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replaceStr);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched all remaining score confetti!");
