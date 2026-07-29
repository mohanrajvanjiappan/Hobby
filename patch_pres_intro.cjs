const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// 1. Add multiplayer-intro to Stage
content = content.replace(
  "type Stage = 'intro' | 'question-selection' | 'question' | 'reveal' | 'quote' | 'score' | 'talk' | 'outro';",
  "type Stage = 'intro' | 'multiplayer-intro' | 'question-selection' | 'question' | 'reveal' | 'quote' | 'score' | 'talk' | 'outro';"
);

// 2. Change intro transition
content = content.replace(
  "if (quiz.mode === 'interactive') {",
  "if (quiz.isMultiplayer) { setStage('multiplayer-intro'); } else if (quiz.mode === 'interactive') {"
);

// 3. Change countdown transition
content = content.replace(
  "clearInterval(interval);\n          audioSynth.playSwoosh();\n          setStage('question');",
  "clearInterval(interval);\n          audioSynth.playSwoosh();\n          if (quiz.isMultiplayer && stage === 'countdown' && selectedQuestionIndex === null) { setStage('question-selection'); } else { setStage('question'); }"
);

// We need to pass selectedQuestionIndex from question-selection.
// Actually, when user clicks a number in question-selection, we set selectedQuestionIndex and setStage('countdown').
// Wait, when selectedQuestionIndex is NOT null, countdown will transition to 'question'. That works perfectly.

// 4. Change reveal transition
const revealTransition = `if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setStage('question');
          } else {
            if (quiz.mode === 'interactive' && quiz.participantTopic) setStage('talk');
            else setStage('outro');
          }`;
          
const newRevealTransition = `if (quiz.isMultiplayer) {
            setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex));
            setCurrentPlayerIndex(prev => (prev + 1) % (quiz.players?.length || 1));
            setSelectedQuestionIndex(null);
            if (answeredQuestions.size + 1 >= quiz.questions.length) {
              setStage('score'); // go to score at the end
            } else {
              setStage('question-selection');
            }
          } else if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setStage('question');
          } else {
            if (quiz.mode === 'interactive' && quiz.participantTopic) setStage('talk');
            else setStage('outro');
          }`;
content = content.replace(revealTransition, newRevealTransition);

fs.writeFileSync('src/components/Presentation.tsx', content);
