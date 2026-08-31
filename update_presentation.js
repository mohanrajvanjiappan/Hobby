import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// 1. Replace the getUserMedia call with a fake stream/placeholder logic.
// We can just skip the getUserMedia entirely.
code = code.replace(
  /try \{\s*const stream = await navigator\.mediaDevices\.getUserMedia\(\{ video: true, audio: false \}\);\s*if \(videoRef\.current\) \{\s*videoRef\.current\.srcObject = stream;\s*\}\s*\} catch \(err\) \{\s*console\.error\("Camera error:", err\);\s*\}/g,
  `try {
          // Camera access removed as requested. Showing a simulated camera view instead.
        } catch (err) {
          console.error("Camera error:", err);
        }`
);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Patched getUserMedia out of Presentation.tsx");
