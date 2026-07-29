const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /if \(currentQuestionIndex < quiz\.questions\.length - 1\) \{\s*setCurrentQuestionIndex\(\(prev\) => prev \+ 1\);\s*setStage\('question'\);\s*\}/;

const newCode = `if (currentQuestionIndex < quiz.questions.length - 1) {
              if (quiz.mode === 'video' && (currentQuestionIndex + 1) % 5 === 0) {
                setStage('video-badges');
              } else {
                setCurrentQuestionIndex((prev) => prev + 1);
                setStage('question');
              }
            }`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/components/Presentation.tsx', content);
