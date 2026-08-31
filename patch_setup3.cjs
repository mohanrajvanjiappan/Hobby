const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const regex = /<div \n            onClick=\{\(\) => setEnableMemoryBreak\(\!enableMemoryBreak\)\}[\s\S]*?<\/div>\n          <\/div>/;

const newUI = `<div 
            onClick={() => setEnableMemoryBreak(!enableMemoryBreak)}
            className="p-3.5 bg-gradient-to-r from-purple-50/80 to-fuchsia-50/80 border-2 border-purple-200/80 rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-500/20">
                🧩
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  Memory Break
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900 border border-purple-300/50">
                    Midway
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-600">
                  Play a memory game halfway through
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableMemoryBreak}
              onChange={(e) => setEnableMemoryBreak(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500 cursor-pointer accent-purple-600"
            />
          </div>
          {enableMemoryBreak && (
             <div 
               onClick={() => setThemeMemoryBreak(!themeMemoryBreak)}
               className="p-3.5 ml-8 bg-gradient-to-r from-purple-50/40 to-fuchsia-50/40 border-2 border-purple-200/50 rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all shadow-sm"
             >
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-purple-400 text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-400/20">
                   🎨
                 </div>
                 <div className="text-left">
                   <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                     Theme Related Objects
                   </div>
                   <div className="text-xs text-slate-500/80 font-medium">Uses AI to generate objects matching the quiz topic</div>
                 </div>
               </div>
               <input
                 type="checkbox"
                 checked={themeMemoryBreak}
                 onChange={(e) => setThemeMemoryBreak(e.target.checked)}
                 onClick={(e) => e.stopPropagation()}
                 className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 cursor-pointer accent-purple-600"
               />
             </div>
          )}`;

code = code.replace(regex, newUI);

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Done");
