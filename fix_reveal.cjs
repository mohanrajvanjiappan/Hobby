const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const startIdx = content.indexOf('const onSpeakEnd = () => {');
const endIdx = content.indexOf('}, 2000);', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `const onSpeakEnd = () => {
        t = setTimeout(() => {
          audioSynth.playSwoosh();
          // Go to next question, or quote if it's the end
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
            }
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
          }
        `;
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync('src/components/Presentation.tsx', content);
}
