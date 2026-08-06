const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Replace setStage('reveal') with immediate advance for rapid-fire
code = code.replace(
  /window\.speechSynthesis\.cancel\(\);\n\s*setStage\('reveal'\);/g,
  (match) => {
    return `window.speechSynthesis.cancel();
                            if (quiz.type === 'rapid-fire') {
                              setCurrentQuestionIndex((prev) => prev + 1);
                              const nextQ = quiz.questions[currentQuestionIndex + 1];
                              if (!nextQ || nextQ.category !== selectedCategory) {
                                setAnsweredQuestions(prevAns => {
                                  const next = new Set(prevAns);
                                  quiz.questions.forEach((q, i) => {
                                      if (q.category === selectedCategory) next.add(i);
                                  });
                                  return next;
                                });
                                if (quiz.isMultiplayer) {
                                  setCurrentPlayerIndex(p => (p + 1) % (quiz.players?.length || 1));
                                  setStage('category-selection');
                                } else {
                                  setStage(categories.length > 1 ? 'category-selection' : 'score');
                                }
                              } else {
                                setStage('question');
                              }
                            } else {
                              setStage('reveal');
                            }`;
  }
);

fs.writeFileSync('src/components/Presentation.tsx', code);
