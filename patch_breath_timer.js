import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// 1. Add Wind to imports
if (!code.includes(' Wind,')) {
    code = code.replace(/import \{ Trophy/, 'import { Trophy, Wind');
}

// 2. Modify BreakMode type
const targetType = `type BreakMode = 'menu' | 'memory-intro' | 'memory-memorize' | 'memory-question' | 'memory-reveal' | 'riddle' | 'word-search' | 'hydration' | 'stretch' | 'eye-rest' | null;`;
const replaceType = `type BreakMode = 'menu' | 'memory-intro' | 'memory-memorize' | 'memory-question' | 'memory-reveal' | 'riddle' | 'word-search' | 'hydration' | 'stretch' | 'eye-rest' | 'mindful-breathing' | null;`;
code = code.replace(targetType, replaceType);

// 3. Add breakElapsedSeconds state
const stateTarget = `  const [breakMemoryItems, setBreakMemoryItems] = useState<string[]>([]);`;
const stateReplace = `  const [breakMemoryItems, setBreakMemoryItems] = useState<string[]>([]);
  const [breakElapsedSeconds, setBreakElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breakMode) {
      interval = setInterval(() => {
        setBreakElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setBreakElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [breakMode]);

  const formatBreakTime = (s: number) => \`\${Math.floor(s / 60).toString().padStart(2, '0')}:\${(s % 60).toString().padStart(2, '0')}\`;
`;
code = code.replace(stateTarget, stateReplace);

// 4. Update the Break button to reset timer (actually handled by useEffect, but we'll leave it clean)
// The useEffect already resets to 0 when breakMode is falsy.

// 5. Add the top-left timer to the break overlay
const overlayTarget = `{breakMode && (
        <div className="absolute inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-y-auto">`;
const overlayReplace = `{breakMode && (
        <div className="absolute inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-y-auto">
           
           <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 px-5 py-3 rounded-2xl backdrop-blur-md text-white font-mono text-3xl font-black border-2 border-white/20 shadow-lg">
             <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
             {formatBreakTime(breakElapsedSeconds)}
           </div>`;
code = code.replace(overlayTarget, overlayReplace);

// 6. Add Mindful Breathing to the menu
const menuTarget = `<button onClick={() => {
                      setBreakMode('eye-rest');
                      audioSynth.speak("The 20 20 20 rule. Look at an object 20 feet away for 20 seconds to rest your eye muscles.");
                  }} className="w-full py-4 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold text-2xl transition-all shadow-lg flex items-center justify-center gap-3">
                    <Eye className="w-8 h-8" /> 20-20-20 Eye Rest
                  </button>
                </div>`;
const menuReplace = `<button onClick={() => {
                      setBreakMode('eye-rest');
                      audioSynth.speak("The 20 20 20 rule. Look at an object 20 feet away for 20 seconds to rest your eye muscles.");
                  }} className="w-full py-4 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold text-2xl transition-all shadow-lg flex items-center justify-center gap-3">
                    <Eye className="w-8 h-8" /> 20-20-20 Eye Rest
                  </button>
                  <button onClick={() => {
                      setBreakMode('mindful-breathing');
                      audioSynth.speak("Time for some mindful breathing. Take a deep breath in... and out...");
                  }} className="w-full py-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-2xl transition-all shadow-lg flex items-center justify-center gap-3">
                    <Wind className="w-8 h-8" /> Mindful Breathing
                  </button>
                </div>`;
code = code.replace(menuTarget, menuReplace);

// 7. Add Mindful Breathing view
const viewTarget = `{breakMode === 'eye-rest' && (`;
const viewReplace = `{breakMode === 'mindful-breathing' && (
             <div className="w-full max-w-4xl bg-white/10 p-12 rounded-[3rem] border-4 border-teal-400/50 shadow-2xl text-center">
                <Wind className="w-24 h-24 text-teal-400 mx-auto mb-8 animate-pulse" />
                <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                  Mindful Breathing
                </h2>
                <p className="text-3xl text-teal-100 mb-12">
                  Take a slow, deep breath in through your nose... and exhale gently through your mouth.
                </p>
                <div className="mx-auto w-32 h-32 rounded-full bg-teal-400/30 border-4 border-teal-300 animate-ping mb-12" style={{ animationDuration: '4s' }}></div>
                <button onClick={() => setBreakMode('menu')} className="px-8 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-2xl transition-all">
                  Back to Menu
                </button>
             </div>
           )}

           {breakMode === 'eye-rest' && (`;
code = code.replace(viewTarget, viewReplace);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Patched Presentation with Mindful Breathing and Timer!");
