const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Replace Question N of M Pill
code = code.replace(
  /<div className="bg-white px-8 py-3 rounded-full shadow-2xl font-black text-slate-800 text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-slate-100">/g,
  '<div className="bg-white/90 backdrop-blur-xl px-8 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] font-black text-slate-900 text-2xl tracking-widest uppercase flex items-center gap-3 border-[4px] border-white/80">'
);

// Replace Quiz Title Pill
code = code.replace(
  /<div className="bg-indigo-700 text-white px-8 py-3 rounded-full shadow-2xl font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-indigo-400">/g,
  '<div className="bg-indigo-600/90 backdrop-blur-xl text-white px-8 py-3 rounded-full shadow-[0_10px_30px_rgba(79,70,229,0.3)] font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-[4px] border-indigo-400/80">'
);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done");
