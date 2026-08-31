const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Modernize headers
code = code.replace(/font-extrabold/g, 'font-black tracking-tight');
code = code.replace(/text-slate-800(.*)leading-tight/g, 'text-slate-900$1leading-tight');

// Add styling for display font to main H2 in the card
code = code.replace(
  /<h2 className=\{\`font-black tracking-tight text-slate-900/g,
  '<h2 style={{ fontFamily: "var(--font-display)" }} className={`font-black tracking-tight text-slate-900'
);

// Do the same for combat mode
code = code.replace(
  /<h2 className="font-black tracking-tight text-slate-900 text-3xl md:text-4xl lg:text-5xl leading-tight mb-8/g,
  '<h2 style={{ fontFamily: "var(--font-display)" }} className="font-black tracking-tight text-slate-900 text-3xl md:text-4xl lg:text-[3rem] leading-tight mb-8'
);

// Enhance options (the buttons)
// Before: `px-6 py-4 rounded-2xl text-xl md:text-2xl font-bold flex items-center gap-4 transition-all duration-500 ${cardClass}`
// After: Add shadow-sm hover:scale-[1.02] border-b-4
code = code.replace(
  /className=\{\`px-6 py-4 rounded-2xl text-xl md:text-2xl font-bold flex items-center gap-4 transition-all duration-500 \$\{cardClass\}\`\}/g,
  'className={`px-6 py-5 rounded-3xl text-xl md:text-2xl font-bold flex items-center gap-4 transition-all duration-300 transform active:scale-95 ${cardClass} shadow-md`}'
);

// Enhance option default cards:
// Before: "bg-slate-100 text-slate-800 border-2 border-slate-200"
// After: "bg-slate-50 text-slate-700 border-2 border-slate-200 hover:bg-slate-100 border-b-[6px]"
code = code.replace(
  /"bg-slate-100 text-slate-800 border-2 border-slate-200"/g,
  '"bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 border-b-[6px] hover:border-b-[6px]"'
);

// Enhance option correct cards:
// Before: "bg-emerald-500 text-white border-2 border-emerald-600 shadow-xl scale-\[1.02\]"
// After: "bg-emerald-500 text-white border-2 border-emerald-600 border-b-[6px] shadow-xl scale-[1.02]"
code = code.replace(
  /"bg-emerald-500 text-white border-2 border-emerald-600 shadow-xl scale-\[1.02\]"/g,
  '"bg-emerald-500 text-white border-2 border-emerald-600 border-b-[6px] shadow-xl scale-[1.03]"'
);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done");
