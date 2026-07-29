const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const targetStr = `                            if (isCorrect) {
                              setScore(s => s + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1));
                              if (quiz.isMultiplayer) {`;

const replaceStr = `                            if (isCorrect) {
                              setScore(s => {
                                const nextScore = s + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
                                if (nextScore >= (quiz.questions.length / 2) * (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1)) {
                                  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                                }
                                return nextScore;
                              });
                              if (quiz.isMultiplayer) {`;

content = content.replace(targetStr, replaceStr);


const targetStr2 = `                          if (isFake) {
                            setScore(s => s + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1));
                              if (quiz.isMultiplayer) {`;

const replaceStr2 = `                          if (isFake) {
                            setScore(s => {
                              const nextScore = s + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
                              if (nextScore >= (quiz.questions.length / 2) * (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1)) {
                                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                              }
                              return nextScore;
                            });
                              if (quiz.isMultiplayer) {`;

content = content.replace(targetStr2, replaceStr2);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched reveal confetti!");
