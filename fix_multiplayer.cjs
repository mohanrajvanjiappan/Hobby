const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /if \(quiz\.isMultiplayer && quiz\.mode !== 'interactive'\) \{[\s\S]*?\} else \{[\s\S]*?if \(quiz\.isMultiplayer && quiz\.mode === 'interactive'\) \{[\s\S]*?setCurrentPlayerIndex\(p => \(p \+ 1\) % playersState\.length\);\s*\}[\s\S]*?if \(currentQuestionIndex < quiz\.questions\.length - 1\)/;

const newCode = `if (quiz.isMultiplayer) {
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
            if (currentQuestionIndex < quiz.questions.length - 1)`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/components/Presentation.tsx', content);
