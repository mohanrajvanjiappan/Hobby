import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const targetButtons = `                  <button onClick={() => {
                      // Generate a simple 8x8 word search
                      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                      const allWordsPool = ["REACT", "QUIZ", "BREAK", "FUN", "PLAY", "GAME", "CODE", "TIME", "FAST", "SMART", "NERD", "GEEK", "COOL", "WINS", "LAUGH"];
                      const words = [...allWordsPool].sort(() => 0.5 - Math.random()).slice(0, 5);
                      const grid = Array(8).fill(null).map(() => Array(8).fill(null).map(() => ({char: letters[Math.floor(Math.random()*26)], found: false})));
                      const placedWords: {word:string, found:boolean}[] = [];
                      for (const word of words) {
                          placedWords.push({word, found: false});
                          // Simplified placement: just horizontal or vertical randomly for this break
                          let placed = false;
                          for(let attempt=0; attempt<50 && !placed; attempt++) {
                              const isHoriz = Math.random() < 0.5;
                              const r = Math.floor(Math.random() * 8);
                              const c = Math.floor(Math.random() * 8);
                              if (isHoriz && c + word.length <= 8) {
                                  grid[r].splice(c, word.length, ...word.split('').map(char => ({char, found: false})));
                                  placed = true;
                              } else if (!isHoriz && r + word.length <= 8) {
                                  for (let i=0; i<word.length; i++) grid[r+i][c] = {char: word[i], found: false};
                                  placed = true;
                              }
                          }
                      }
                      setBreakWordSearchGrid(grid);
                      setBreakWordSearchWords(placedWords);
                      setBreakMode('word-search');
                  }} className="w-full py-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-2xl transition-all shadow-lg flex items-center justify-center gap-3">
                    <Search className="w-8 h-8" /> Word Search Break
                  </button>
                </div>`;

const replaceButtons = `                  <button onClick={() => {
                      // Generate a simple 8x8 word search
                      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                      const allWordsPool = ["REACT", "QUIZ", "BREAK", "FUN", "PLAY", "GAME", "CODE", "TIME", "FAST", "SMART", "NERD", "GEEK", "COOL", "WINS", "LAUGH"];
                      const words = [...allWordsPool].sort(() => 0.5 - Math.random()).slice(0, 5);
                      const grid = Array(8).fill(null).map(() => Array(8).fill(null).map(() => ({char: letters[Math.floor(Math.random()*26)], found: false})));
                      const placedWords: {word:string, found:boolean}[] = [];
                      for (const word of words) {
                          placedWords.push({word, found: false});
                          // Simplified placement: just horizontal or vertical randomly for this break
                          let placed = false;
                          for(let attempt=0; attempt<50 && !placed; attempt++) {
                              const isHoriz = Math.random() < 0.5;
                              const r = Math.floor(Math.random() * 8);
                              const c = Math.floor(Math.random() * 8);
                              if (isHoriz && c + word.length <= 8) {
                                  grid[r].splice(c, word.length, ...word.split('').map(char => ({char, found: false})));
                                  placed = true;
                              } else if (!isHoriz && r + word.length <= 8) {
                                  for (let i=0; i<word.length; i++) grid[r+i][c] = {char: word[i], found: false};
                                  placed = true;
                              }
                          }
                      }
                      setBreakWordSearchGrid(grid);
                      setBreakWordSearchWords(placedWords);
                      setBreakMode('word-search');
                  }} className="w-full py-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-2xl transition-all shadow-lg flex items-center justify-center gap-3">
                    <Search className="w-8 h-8" /> Word Search Break
                  </button>
                  <button onClick={() => {
                      setBreakMode('hydration');
                      audioSynth.speak("Hydration check! Make sure to drink enough water.");
                  }} className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-2xl transition-all shadow-lg flex items-center justify-center gap-3">
                    <Droplets className="w-8 h-8" /> Hydration Check
                  </button>
                  <button onClick={() => {
                      setBreakMode('stretch');
                      audioSynth.speak("Time for a gentle stretch! Let's get up and move around a bit.");
                  }} className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-2xl transition-all shadow-lg flex items-center justify-center gap-3">
                    <Activity className="w-8 h-8" /> Gentle Stretching
                  </button>
                  <button onClick={() => {
                      setBreakMode('eye-rest');
                      audioSynth.speak("The 20 20 20 rule. Look at an object 20 feet away for 20 seconds to rest your eye muscles.");
                  }} className="w-full py-4 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold text-2xl transition-all shadow-lg flex items-center justify-center gap-3">
                    <Eye className="w-8 h-8" /> 20-20-20 Eye Rest
                  </button>
                </div>`;

if (!code.includes(targetButtons)) {
    console.error("Target Buttons not found!");
}

code = code.replace(targetButtons, replaceButtons);

const targetViews = `           {breakMode === 'word-search' && (`;

const replaceViews = `           {breakMode === 'hydration' && (
             <div className="w-full max-w-4xl bg-white/10 p-12 rounded-[3rem] border-4 border-cyan-400/50 shadow-2xl text-center">
                <Droplets className="w-24 h-24 text-cyan-400 mx-auto mb-8 animate-bounce" />
                <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                  Hydration Check!
                </h2>
                <p className="text-3xl text-cyan-100 mb-12">
                  Take a moment to drink some water. Staying hydrated keeps your brain sharp and helps you focus!
                </p>
                <button onClick={() => setBreakMode('menu')} className="px-8 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-2xl transition-all">
                  Back to Menu
                </button>
             </div>
           )}

           {breakMode === 'stretch' && (
             <div className="w-full max-w-4xl bg-white/10 p-12 rounded-[3rem] border-4 border-orange-400/50 shadow-2xl text-center">
                <Activity className="w-24 h-24 text-orange-400 mx-auto mb-8 animate-pulse" />
                <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                  Gentle Stretching
                </h2>
                <p className="text-3xl text-orange-100 mb-12">
                  Stand up, stretch your arms, roll your shoulders, and loosen up! A quick physical break resets your energy.
                </p>
                <button onClick={() => setBreakMode('menu')} className="px-8 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-2xl transition-all">
                  Back to Menu
                </button>
             </div>
           )}

           {breakMode === 'eye-rest' && (
             <div className="w-full max-w-4xl bg-white/10 p-12 rounded-[3rem] border-4 border-fuchsia-400/50 shadow-2xl text-center">
                <Eye className="w-24 h-24 text-fuchsia-400 mx-auto mb-8 animate-pulse" />
                <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                  The 20-20-20 Rule
                </h2>
                <p className="text-3xl text-fuchsia-100 mb-12">
                  Look at an object at least <strong>20 feet</strong> away for <strong>20 seconds</strong>. This helps rest your eye muscles and prevents screen fatigue!
                </p>
                <button onClick={() => setBreakMode('menu')} className="px-8 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-2xl transition-all">
                  Back to Menu
                </button>
             </div>
           )}

           {breakMode === 'word-search' && (`;

if (!code.includes(targetViews)) {
    console.error("Target Views not found!");
}

code = code.replace(targetViews, replaceViews);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Patched Presentation with New Breaks");
