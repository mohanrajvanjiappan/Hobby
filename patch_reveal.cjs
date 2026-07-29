const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /\/\/ Go to next question, or quote if it's the end[\s\S]*?if \(!?quiz\.mode === 'interactive'\) \{[\s\S]*?setStage\('outro'\);\s*\}\s*\}/;
// Wait, regex might be tricky, let's just replace the exact block.

const oldBlock = `          // Go to next question, or quote if it's the end
          if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setStage('question');
          } else if (quiz.quotes && quiz.quotes.length > 0 && quiz.mode !== 'interactive') {
            setStage('quote');
          } else {
            if (quiz.mode === 'interactive') {
               setStage('score');
            } else {
               setStage('outro');
            }
          }`;

const newBlock = `          // Go to next question, or quote if it's the end
          if (quiz.isMultiplayer) {
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
            if (currentQuestionIndex < quiz.questions.length - 1) {
              setCurrentQuestionIndex((prev) => prev + 1);
              setStage('question');
            } else if (quiz.quotes && quiz.quotes.length > 0 && quiz.mode !== 'interactive') {
              setStage('quote');
            } else {
              if (quiz.mode === 'interactive') {
                 setStage('score');
              } else {
                 setStage('outro');
              }
            }
          }`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync('src/components/Presentation.tsx', content);
