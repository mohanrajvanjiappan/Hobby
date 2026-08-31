const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  '<div className="h-6 md:h-8 bg-black/20 rounded-full overflow-hidden p-1 backdrop-blur-md border-4 border-white/30 shadow-inner relative">',
  '<div className="h-6 md:h-8 bg-slate-900/10 rounded-full overflow-hidden p-1 backdrop-blur-xl border-[4px] border-white/60 shadow-inner relative">'
);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done");
