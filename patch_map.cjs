const fs = require('fs');
let code = fs.readFileSync('src/components/MapQuestion.tsx', 'utf8');

const regex = /<div className="w-full h-full rounded-\[2rem\] overflow-hidden shadow-inner border-4 border-slate-200 bg-slate-100 relative">([\s\S]*?)<\/div>/;

const newMap = `<div className="w-full h-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[8px] border-slate-800 bg-slate-900 relative group">
      {/* Cool targeting overlay */}
      <div className="absolute inset-0 z-[400] pointer-events-none mix-blend-screen opacity-50">
        <div className="absolute top-0 left-0 w-full h-full border-[1px] border-emerald-400/30" style={{ background: 'radial-gradient(circle, transparent 60%, rgba(16, 185, 129, 0.1) 100%)' }} />
        {/* Crosshairs */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-400/40" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-emerald-400/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-emerald-400/50 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[1px] border-emerald-400/20 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
      </div>
      
      {timeLeft <= 0 && (
         <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[500] pointer-events-none flex flex-col items-center animate-bounce">
            <div className="bg-emerald-500 text-white font-black px-6 py-2 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.8)] border-2 border-white tracking-widest uppercase text-xl">
               Target Acquired
            </div>
         </div>
      )}

      $1
    </div>`;

code = code.replace(regex, newMap);
fs.writeFileSync('src/components/MapQuestion.tsx', code);
