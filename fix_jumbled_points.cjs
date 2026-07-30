const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const search = `    if (isCorrect) {
      setScore(s => s + (quiz.isMultiplayer ? 10 : 1));
      if (quiz.isMultiplayer) {
        setPlayersState(prev => {
          const next = [...prev];
          if (next[currentPlayerIndex]) {
            next[currentPlayerIndex] = { ...next[currentPlayerIndex], score: next[currentPlayerIndex].score + 10 };
          }
          return next;
        });
      }`;

const replace = `    if (isCorrect) {
      setScore(s => s + getAwardPoints());
      if (quiz.isMultiplayer) {
        setPlayersState(prev => {
          const next = [...prev];
          if (next[currentPlayerIndex]) {
            next[currentPlayerIndex] = { ...next[currentPlayerIndex], score: next[currentPlayerIndex].score + getAwardPoints() };
          }
          return next;
        });
      }`;

content = content.replace(search, replace);
fs.writeFileSync('src/components/Presentation.tsx', content);
