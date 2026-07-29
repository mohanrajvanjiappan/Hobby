const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldRevealStart = `    if (stage === 'reveal') {
      audioSynth.stopBackgroundMusic();
      audioSynth.playCorrect();`;

const newRevealStart = `    if (stage === 'reveal') {
      audioSynth.stopBackgroundMusic();
      if (!(quiz.mode === 'interactive' && interactiveOptionClicked !== null)) {
        audioSynth.playCorrect();
      }`;

content = content.replace(oldRevealStart, newRevealStart);
fs.writeFileSync('src/components/Presentation.tsx', content);
