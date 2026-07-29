const https = require('https');
https.get('https://actions.google.com/sounds/v1/cartoon/magic_chime_chord.ogg', (res) => {
  console.log("Magic chime:", res.statusCode);
});
https.get('https://actions.google.com/sounds/v1/human_voices/human_crowd_cheer.ogg', (res) => {
  console.log("Cheer:", res.statusCode);
});
