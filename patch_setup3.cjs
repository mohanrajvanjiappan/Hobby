const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

code = code.replace(
  `        questions: data.questions.map((q: any) => ({
          ...q,
          category: q.category || 'General',
          timeLimit: (quizType === 'rapid-fire' ? 60 : 15)
        })),`,
  `        questions: data.questions.map((q: any, i: number) => {
          let cat = q.category || 'General';
          if (quizType === 'rapid-fire' && numPlayers > 1) {
            const perPlayer = Math.ceil(data.questions.length / numPlayers);
            const setNum = Math.floor(i / perPlayer) + 1;
            cat = \`Set \${setNum}\`;
          }
          return {
            ...q,
            category: cat,
            timeLimit: (quizType === 'rapid-fire' ? 60 : 15)
          };
        }),`
);

fs.writeFileSync('src/components/Setup.tsx', code);
