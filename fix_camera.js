import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /const stream = await navigator\.mediaDevices\.getUserMedia\(\{ video: true, audio: false \}\);\s*setStreams\(\(prev\) => \(\{ \.\.\.prev, \[id\]: stream \}\)\);/g,
  "// No real camera access\n        // setStreams not populated with real stream"
);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Fixed camera access");
