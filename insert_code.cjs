const fs = require('fs');
const content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');
const insertPoint = `  const isInteractiveTimeout = quiz.mode === 'interactive' && stage === 'reveal' && interactiveOptionClicked === null;`;
const codeToInsert = `

  const handleJumbledSubmit = () => {
    if (stage === 'reveal' || !jumbledInput.trim()) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const isCorrect = jumbledInput.trim().toLowerCase() === question.correctAnswer.toLowerCase();
    
    setInteractiveOptionClicked(isCorrect ? question.correctAnswer : jumbledInput);
    
    if (isCorrect) {
      setScore(s => s + (quiz.isMultiplayer ? 10 : 1));
      if (quiz.isMultiplayer) {
        setPlayersState(prev => {
          const next = [...prev];
          if (next[currentPlayerIndex]) {
            next[currentPlayerIndex] = { ...next[currentPlayerIndex], score: next[currentPlayerIndex].score + 10 };
          }
          return next;
        });
      }
      audioSynth.playCorrect();
      if (quiz.enableClapping !== false && Math.random() < 0.4) {
        setTimeout(() => audioSynth.playClap(), 300);
      }
    } else {
      audioSynth.playWrong();
    }
    window.speechSynthesis.cancel();
    setStage('reveal');
  };
`;
fs.writeFileSync('src/components/Presentation.tsx', content.replace(insertPoint, insertPoint + codeToInsert));
