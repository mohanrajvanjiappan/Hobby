const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Replace category selection click handler
code = code.replace(
  `                      if (quiz.type === 'rapid-fire') {
                        const firstCatQ = catQuestions[0].idx;
                        setCurrentQuestionIndex(firstCatQ);
                        setStage('question');
                      } else {`,
  `                      if (quiz.type === 'rapid-fire') {
                        const firstCatQ = catQuestions[0].idx;
                        setCurrentQuestionIndex(firstCatQ);
                        setTimeLeft(catQuestions[0].q.timeLimit);
                        setStage('question');
                      } else {`
);

// Replace timeLimit logic in question stage
code = code.replace(
  `        audioSynth.speak(textToSpeak || 'Identify the image');
        setTimeLeft(question.timeLimit);
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.mode !== 'interactive' || prev <= 6) audioSynth.playTick();
            return prev - 1;
          });
        }, 1000);`,
  `        audioSynth.speak(textToSpeak || 'Identify the image');
        if (quiz.type !== 'rapid-fire') {
          setTimeLeft(question.timeLimit);
        }
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              if (quiz.type === 'rapid-fire') {
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
                setStage('reveal');
              }
              return 0;
            }
            if (quiz.mode !== 'interactive' || prev <= 6) audioSynth.playTick();
            return prev - 1;
          });
        }, 1000);`
);

fs.writeFileSync('src/components/Presentation.tsx', code);
