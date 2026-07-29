const https = require('https');
https.get('https://cdn.jsdelivr.net/npm/freesound-samples@1.0.0/samples/success.mp3', (res) => {
  console.log("jsdelivr Success:", res.statusCode);
});
