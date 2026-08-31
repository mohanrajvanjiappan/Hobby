const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /<h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-\[0_4px_20px_rgba\(0,0,0,0\.8\)\] tracking-tight">/g,
  '<h1 style={{ fontFamily: "var(--font-display)" }} className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] tracking-tight">'
);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done");
