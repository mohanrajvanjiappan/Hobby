const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const videoBadgesReplace = `    if (stage === 'video-badges') {
      audioSynth.playHTML5Badge();
      audioSynth.playSwoosh();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const numAnswered = currentQuestionIndex + 1;`;

content = content.replace(`    if (stage === 'video-badges') {
      audioSynth.playHTML5Badge();
      audioSynth.playSwoosh();
      const numAnswered = currentQuestionIndex + 1;`, videoBadgesReplace);


const badgesReplace = `    if (stage === 'badges') {
      audioSynth.playHTML5Badge();
      audioSynth.playSwoosh();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
      audioSynth.speak('Here are the badges you earned!');`;

content = content.replace(`    if (stage === 'badges') {
      audioSynth.playHTML5Badge();
      audioSynth.playSwoosh();
      audioSynth.speak('Here are the badges you earned!');`, badgesReplace);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched confetti!");
