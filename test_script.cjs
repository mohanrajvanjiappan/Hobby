const fs = require('fs');
let text = fs.readFileSync('src/lib/audio.ts', 'utf8');
if (text.includes('this.correctAudio.play()')) {
    console.log("Looks good");
} else {
    console.log("Missing play");
}
