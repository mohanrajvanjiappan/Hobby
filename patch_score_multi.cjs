const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// We need to replace all instances of `setScore(s => s + 1);`
const newScoreLogic = `
                              setScore(s => s + 1);
                              if (quiz.isMultiplayer) {
                                setPlayersState(prev => {
                                  const next = [...prev];
                                  if (next[currentPlayerIndex]) {
                                    next[currentPlayerIndex] = { ...next[currentPlayerIndex], score: next[currentPlayerIndex].score + 1 };
                                  }
                                  return next;
                                });
                              }
`;

content = content.replace(/setScore\(s => s \+ 1\);/g, newScoreLogic.trim());

fs.writeFileSync('src/components/Presentation.tsx', content);
