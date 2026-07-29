const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const original = `          if (quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode') {
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
          }`;

const replacement = `          if (quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode') {
            const willComplete = answeredQuestions.size + (answeredQuestions.has(currentQuestionIndex) ? 0 : 1) >= quiz.questions.length;
            setAnsweredQuestions(prev => {
              const next = new Set(prev);
              next.add(currentQuestionIndex);
              return next;
            });
            if (willComplete) {
              setStage('score');
            } else {
              setCurrentPlayerIndex(p => (p + 1) % playersState.length);
              setStage('question-selection');
            }
          }`;

content = content.replace(original, replacement);
fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched!");
