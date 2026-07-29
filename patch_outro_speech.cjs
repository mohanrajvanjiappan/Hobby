const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldSpeech = `    if (stage === 'outro') {
      audioSynth.speak(outroMessage.speech);
    }`;

const newSpeech = `    if (stage === 'outro') {
      if (quiz.mode === 'interactive') {
        audioSynth.speak(\`Great job \${quiz.teamName || 'Player 1'}, you scored \${score} out of \${quiz.questions.length}!\`);
      } else {
        audioSynth.speak(outroMessage.speech);
      }
    }`;

content = content.replace(oldSpeech, newSpeech);
fs.writeFileSync('src/components/Presentation.tsx', content);
