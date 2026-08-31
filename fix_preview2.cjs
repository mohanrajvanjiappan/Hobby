const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf-8');

const target2 = `      if (enableInsightImages && data.questions?.some((q: any) => q.insightImageUrl)) {
        setPreviewQuizData({ quiz: data, mode });
      } else {
        if (mode === 'interactive') {
          setPendingInteractiveQuiz(data);
        } else {
          setLoadedOfflineQuiz(data);
        }
      }`;

const replace2 = `      if (mode === 'interactive') {
        setPendingInteractiveQuiz(data);
      } else {
        setLoadedOfflineQuiz(data);
      }`;

code = code.replace(target2, replace2);
fs.writeFileSync('src/components/Setup.tsx', code);
