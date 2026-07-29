const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const newCode = `    if (stage === 'video-badges') {
      audioSynth.playSwoosh();
      const numAnswered = currentQuestionIndex + 1;
      audioSynth.speak(\`Wow, you've reached \${numAnswered} questions! Here is a badge for your great effort! Keep it up!\`, () => {
        setTimeout(() => {
           setCurrentQuestionIndex((prev) => prev + 1);
           setStage('question');
        }, 3000);
      });
      return () => window.speechSynthesis.cancel();
    }

    if (stage === 'badges') {`;

content = content.replace("    if (stage === 'badges') {", newCode);
fs.writeFileSync('src/components/Presentation.tsx', content);
