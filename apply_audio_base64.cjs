const fs = require('fs');
const audioData = JSON.parse(fs.readFileSync('audio_base64.json', 'utf8'));

let content = fs.readFileSync('src/lib/audio.ts', 'utf8');
content = content.replace(
  "this.html5Correct = new Audio('https://actions.google.com/sounds/v1/cartoon/magic_chime_chord.ogg');",
  `this.html5Correct = new Audio('${audioData.chime}');`
);
content = content.replace(
  "this.html5Badge = new Audio('https://actions.google.com/sounds/v1/human_voices/human_crowd_cheer.ogg');",
  `this.html5Badge = new Audio('${audioData.cheer}');`
);

fs.writeFileSync('src/lib/audio.ts', content);
console.log("Patched audio.ts with base64 audio!");
