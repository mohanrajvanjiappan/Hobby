const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf-8');

const target1 = `      if (enableInsightImages && finalQuiz.questions?.some(q => q.insightImageUrl)) {
        setPreviewQuizData({ quiz: finalQuiz, mode });
      } else {
        if (mode === 'interactive') {
          setPendingInteractiveQuiz(finalQuiz);
        } else {
          onQuizGenerated(finalQuiz);
        }
      }`;

const replace1 = `      if (mode === 'interactive') {
        setPendingInteractiveQuiz(finalQuiz);
      } else {
        onQuizGenerated(finalQuiz);
      }`;

code = code.replace(target1, replace1);

const target2 = `      if (enableInsightImages && data.questions?.some((q: any) => q.insightImageUrl)) {
        setPreviewQuizData({ quiz: data, mode });
      } else {
        if (mode === 'interactive') {
          setPendingInteractiveQuiz(data);
        } else {
          onQuizGenerated(data);
        }
      }`;

const replace2 = `      if (mode === 'interactive') {
        setPendingInteractiveQuiz(data);
      } else {
        onQuizGenerated(data);
      }`;

code = code.replace(target2, replace2);
fs.writeFileSync('src/components/Setup.tsx', code);
