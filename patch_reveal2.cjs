const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /\/\/ Go to next question, or quote if it's the end[\s\S]*?\} else \{/;
const newCode = `// Go to next question, or quote if it's the end
          if (quiz.isMultiplayer && quiz.mode !== 'interactive') {
            setAnsweredQuestions(prev => {
              const next = new Set(prev);
              next.add(currentQuestionIndex);
              
              if (next.size >= quiz.questions.length) {
                setStage('score');
              } else {
                setCurrentPlayerIndex(p => (p + 1) % playersState.length);
                setStage('question-selection');
              }
              return next;
            });
          } else {
            if (quiz.isMultiplayer && quiz.mode === 'interactive') {
              setCurrentPlayerIndex(p => (p + 1) % playersState.length);
            }`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/components/Presentation.tsx', content);
