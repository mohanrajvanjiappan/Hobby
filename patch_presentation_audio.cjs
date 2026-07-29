const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(/audioSynth\.playCorrect\(\)/g, 'audioSynth.playHTML5Correct()');
content = content.replace(/audioSynth\.playVictory\(\)/g, 'audioSynth.playVictory();\n      audioSynth.playHTML5Badge();');

content = content.replace(/if \(stage === 'video-badges'\) \{\n      audioSynth\.playSwoosh\(\);/g, "if (stage === 'video-badges') {\n      audioSynth.playHTML5Badge();\n      audioSynth.playSwoosh();");

content = content.replace(/if \(stage === 'badges'\) \{\n      audioSynth\.playSwoosh\(\);/g, "if (stage === 'badges') {\n      audioSynth.playHTML5Badge();\n      audioSynth.playSwoosh();");

fs.writeFileSync('src/components/Presentation.tsx', content);
