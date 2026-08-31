const fs = require('fs');

// Patch types
let typesCode = fs.readFileSync('src/types.ts', 'utf8');
typesCode = typesCode.replace(
  "export interface Quiz {\n  isOfflineMode?: boolean;",
  "export interface Quiz {\n  isOfflineMode?: boolean;\n  dynamicColors?: boolean;"
);
fs.writeFileSync('src/types.ts', typesCode);

// Patch Setup.tsx
let setupCode = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// Add state
setupCode = setupCode.replace(
  "const [themeMemoryBreak, setThemeMemoryBreak] = useState<boolean>(false);",
  "const [themeMemoryBreak, setThemeMemoryBreak] = useState<boolean>(false);\n  const [enableDynamicColors, setEnableDynamicColors] = useState<boolean>(false);"
);

// Add to payloads
setupCode = setupCode.replace(
  /enableMemoryBreak, themeMemoryBreak, enableInsightImages/g,
  "enableMemoryBreak, themeMemoryBreak, enableInsightImages, dynamicColors: enableDynamicColors"
);

setupCode = setupCode.replace(
  "data.themeMemoryBreak = themeMemoryBreak;",
  "data.themeMemoryBreak = themeMemoryBreak;\n      data.dynamicColors = enableDynamicColors;"
);

// Add UI
const dynamicColorsUI = `
          {/* Dynamic Colors Toggle */}
          <div 
            onClick={() => setEnableDynamicColors(!enableDynamicColors)}
            className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-2 border-blue-200/80 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
                🎨
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  Dynamic Colors
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 border border-blue-300/50">
                    Video Mode
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-600">
                  Automatically change background colors
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableDynamicColors}
              onChange={(e) => setEnableDynamicColors(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
            />
          </div>`;

setupCode = setupCode.replace(
  "{/* Clapping Toggle */}",
  dynamicColorsUI + "\n          {/* Clapping Toggle */}"
);

fs.writeFileSync('src/components/Setup.tsx', setupCode);
console.log("Done");
