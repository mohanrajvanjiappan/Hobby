const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldEffect = `    if (stage === 'score') {
      audioSynth.playVictory();
      let t: NodeJS.Timeout;
      audioSynth.speak(\`Great job \${quiz.teamName || 'Player 1'}, you scored \${score} out of \${quiz.questions.length}!\`, () => {
        t = setTimeout(() => {
          if (quiz.participantTopic && quiz.participantTopic.trim()) {
            setStage('talk');
          } else {
            setStage('outro');
          }
        }, 3000);
      });
      
      return () => {
        if (t) clearTimeout(t);
        window.speechSynthesis.cancel();
      };
    }`;

const newEffect = `    if (stage === 'score') {
      audioSynth.playVictory();
      let t: NodeJS.Timeout;
      
      if (quiz.isMultiplayer) {
        const sorted = [...playersState].sort((a, b) => b.score - a.score);
        const winner = sorted[0];
        audioSynth.speak(\`Congratulations \${winner.name}, you are the winner!\`, () => {
          // In multiplayer, we'll let them click the Finish button
        });
      } else {
        audioSynth.speak(\`Great job \${quiz.teamName || 'Player 1'}, you scored \${score} out of \${quiz.questions.length}!\`, () => {
          t = setTimeout(() => {
            if (quiz.participantTopic && quiz.participantTopic.trim()) {
              setStage('talk');
            } else {
              setStage('outro');
            }
          }, 3000);
        });
      }
      
      return () => {
        if (t) clearTimeout(t);
        window.speechSynthesis.cancel();
      };
    }`;

content = content.replace(oldEffect, newEffect);

fs.writeFileSync('src/components/Presentation.tsx', content);
