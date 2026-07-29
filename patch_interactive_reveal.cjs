const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldRevealEnd = `      if (speechText) {
        audioSynth.speak(speechText, onSpeakEnd);
      } else {
        onSpeakEnd();
      }`;

const newRevealEnd = `      if (quiz.mode === 'interactive' && interactiveOptionClicked) {
        onSpeakEnd();
      } else {
        if (speechText) {
          audioSynth.speak(speechText, onSpeakEnd);
        } else {
          onSpeakEnd();
        }
      }`;

content = content.replace(oldRevealEnd, newRevealEnd);
fs.writeFileSync('src/components/Presentation.tsx', content);
