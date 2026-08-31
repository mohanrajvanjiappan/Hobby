const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /bg-white rounded-\[3rem\] shadow-\[0_20px_50px_rgba\(0,0,0,0\.3\)\]/g;
const replacement = "bg-white/95 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)]";

code = code.replace(regex, replacement);

const regex2 = /border-b-\[12px\] border-slate-200/g;
const replacement2 = "border-t-[4px] border-white/80 border-b-[12px] border-slate-200";

code = code.replace(regex2, replacement2);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done");
