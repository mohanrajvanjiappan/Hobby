const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Inside text-presentation transition
content = content.replace(
  "if (currentQuestionIndex < quiz.questions.length - 1) {\n                  setCurrentQuestionIndex((p) => p + 1);\n                  setStage('question');\n                } else {\n                  setStage('outro');\n                }",
  "if (currentQuestionIndex < quiz.questions.length - 1) {\n                  setCurrentQuestionIndex((p) => p + 1);\n                  setStage('question');\n                } else {\n                  if (quiz.mode === 'interactive' && quiz.participantTopic) setStage('talk');\n                  else setStage('outro');\n                }"
);

// Second occurrence (for the else block)
content = content.replace(
  "if (currentQuestionIndex < quiz.questions.length - 1) {\n                  setCurrentQuestionIndex((p) => p + 1);\n                  setStage('question');\n                } else {\n                  setStage('outro');\n                }",
  "if (currentQuestionIndex < quiz.questions.length - 1) {\n                  setCurrentQuestionIndex((p) => p + 1);\n                  setStage('question');\n                } else {\n                  if (quiz.mode === 'interactive' && quiz.participantTopic) setStage('talk');\n                  else setStage('outro');\n                }"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
