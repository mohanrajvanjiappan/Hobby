const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf-8');

const targetUI = `{enableMemoryBreak && (
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

const replaceUI = `{enableMemoryBreak && (
            <div className="ml-8 space-y-3">
             <div 
               onClick={() => setThemeMemoryBreak(!themeMemoryBreak)}
               className="p-3.5 bg-gradient-to-r from-purple-50/40 to-fuchsia-50/40 border-2 border-purple-200/50 rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all shadow-sm"
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
             
             <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-3 shadow-sm">
                 <div className="flex items-center justify-between">
                   <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                     <span className="text-lg">🔢</span> Number of Images
                   </label>
                   <span className="text-sm font-black text-purple-600 bg-purple-100 px-3 py-1 rounded-full shadow-inner">{memoryBreakImageCount}</span>
                 </div>
                 <input
                   type="range"
                   min="5"
                   max="20"
                   value={memoryBreakImageCount}
                   onChange={(e) => setMemoryBreakImageCount(parseInt(e.target.value))}
                   className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                 />
                 <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                   <span>5</span>
                   <span>10</span>
                   <span>15</span>
                   <span>20</span>
                 </div>
             </div>
            </div>
          )}`;

code = code.replace(targetUI, replaceUI);
fs.writeFileSync('src/components/Setup.tsx', code);
