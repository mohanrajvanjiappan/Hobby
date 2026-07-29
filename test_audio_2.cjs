const https = require('https');
https.get('https://upload.wikimedia.org/wikipedia/commons/3/34/Sound_Effect_-_Success_01.ogg', (res) => {
  console.log("Wikimedia Success:", res.statusCode);
});
https.get('https://upload.wikimedia.org/wikipedia/commons/6/6e/Crowd_cheer.ogg', (res) => {
  console.log("Wikimedia Cheer:", res.statusCode);
});
