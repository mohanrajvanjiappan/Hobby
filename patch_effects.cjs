const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /if \(stage === 'score'\) \{[\s\S]*?if \(stage === 'talk'\)/;
const replacement = `if (stage === 'score') {
      audioSynth.playVictory();
      let t: NodeJS.Timeout;
      
      if (quiz.isMultiplayer) {
        const sorted = [...playersState].sort((a, b) => b.score - a.score);
        const winner = sorted[0];
        audioSynth.speak(\`Congratulations \${winner?.name}, you are the winner!\`, () => {});
      } else {
        audioSynth.speak(\`Great job \${quiz.teamName || 'Player 1'}, you scored \${score} out of \${quiz.questions.length}!\`, () => {
          t = setTimeout(() => {
            setStage('badges');
          }, 3000);
        });
      }
      
      return () => {
        if (t) clearTimeout(t);
        window.speechSynthesis.cancel();
      };
    }

    if (stage === 'badges') {
      audioSynth.playSwoosh();
      audioSynth.speak('Here are the badges you earned!');
      const generatedBadges = [];
      
      const topicWord = quiz.topic.split(' ')[0] || 'Quiz';
      
      if (quiz.isMultiplayer) {
        playersState.forEach(p => {
          if (p.score === quiz.questions.length && quiz.questions.length > 0) {
            generatedBadges.push({ player: p.name, name: 'Perfect Score', icon: '🏆', description: 'Answered everything correctly!' });
          } else if (p.score >= quiz.questions.length / 2 && quiz.questions.length > 0) {
            generatedBadges.push({ player: p.name, name: \`\${topicWord} Whiz\`, icon: '🧠', description: \`Showed great knowledge of \${quiz.topic}!\` });
          } else {
             generatedBadges.push({ player: p.name, name: 'Fast Learner', icon: '🌱', description: 'Gained new knowledge today!' });
          }
        });
        
        const sorted = [...playersState].sort((a,b) => b.score - a.score);
        if (sorted[0] && sorted[0].score > 0) {
           generatedBadges.push({ player: sorted[0].name, name: 'Quiz Master', icon: '👑', description: 'Achieved the highest score!' });
        }
      } else {
        const pName = quiz.teamName || 'Player 1';
        if (score === quiz.questions.length && quiz.questions.length > 0) {
          generatedBadges.push({ player: pName, name: 'Perfect Score', icon: '🏆', description: 'Answered everything correctly!' });
        } else if (score >= quiz.questions.length / 2 && quiz.questions.length > 0) {
          generatedBadges.push({ player: pName, name: \`\${topicWord} Whiz\`, icon: '🧠', description: \`Showed great knowledge of \${quiz.topic}!\` });
        } else {
          generatedBadges.push({ player: pName, name: 'Fast Learner', icon: '🌱', description: 'Gained new knowledge today!' });
        }
        generatedBadges.push({ player: pName, name: 'Fast Thinker', icon: '⚡', description: 'Answered questions with speed!' });
      }
      
      setEarnedBadges(generatedBadges);
    }

    if (stage === 'talk')`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/Presentation.tsx', content);
