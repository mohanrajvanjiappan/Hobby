import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const stateTarget = `  const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);`;
const stateReplace = `  const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);
  
  type BreakMode = 'menu' | 'memory-intro' | 'memory-memorize' | 'memory-question' | 'memory-reveal' | 'riddle' | 'word-search' | null;
  const [breakMode, setBreakMode] = useState<BreakMode>(null);
  const breakRiddles = [
    { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An Echo" },
    { q: "You measure my life in hours and I serve you by expiring. I'm quick when I'm thin and slow when I'm fat. The wind is my enemy.", a: "A Candle" },
    { q: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", a: "A Map" },
    { q: "What is seen in the middle of March and April that can't be seen at the beginning or end of either month?", a: "The letter 'R'" },
    { q: "You see a boat filled with people. It has not sunk, but when you look again you don’t see a single person on the boat. Why?", a: "All the people were married" }
  ];
  const [breakRiddleIndex, setBreakRiddleIndex] = useState(0);
  const [showBreakRiddleAnswer, setShowBreakRiddleAnswer] = useState(false);
  const [breakWordSearchGrid, setBreakWordSearchGrid] = useState<{char:string, found:boolean}[][]>([]);
  const [breakWordSearchWords, setBreakWordSearchWords] = useState<{word:string, found:boolean}[]>([]);
  const [breakWsStartNode, setBreakWsStartNode] = useState<{r:number, c:number} | null>(null);
  const [breakWsCurrentSelection, setBreakWsCurrentSelection] = useState<{r:number, c:number}[]>([]);
  const breakTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [breakMemoryTarget, setBreakMemoryTarget] = useState('');
  const [breakMemoryItems, setBreakMemoryItems] = useState<string[]>([]);
`;
code = code.replace(stateTarget, stateReplace);

// We need to add the break overlay and button before the exit button
const renderTarget = `      <button 
        onClick={onExit}
        className="absolute top-0 left-0 w-16 h-16 opacity-0 z-50 cursor-default"
        title="Hidden Exit Button"
      />`;
const renderReplace = `      <button 
        onClick={onExit}
        className="absolute top-0 left-0 w-16 h-16 opacity-0 z-50 cursor-default"
        title="Hidden Exit Button"
      />
      
      {quiz.mode === 'interactive' && quiz.players && quiz.players.length > 1 && !breakMode && stage !== 'outro' && (
         <button onClick={() => { setIsPaused(true); setBreakMode('menu'); }} className="absolute top-6 left-20 z-50 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white font-bold border-2 border-white/40 hover:bg-white/30 transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95">
            <Coffee className="w-5 h-5" /> Break
         </button>
      )}

      {breakMode && (
        <div className="absolute inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-y-auto">
           {breakMode === 'menu' && (
             <div className="w-full max-w-2xl bg-white/10 p-8 rounded-3xl border-4 border-white/20 shadow-2xl text-center">
                <h2 className="text-5xl font-black text-white mb-8 drop-shadow-lg flex items-center justify-center gap-4">
                  <Coffee className="w-12 h-12 text-amber-400" /> Quiz Break
                </h2>
                <div className="flex flex-col gap-4">
                  <button onClick={() => {
                      const allEmoji = ['🍎','🚗','🎸','⚽','📱','🔑','🍕','🚀','📚','🚲','🎨','🍦'];
                      const shuffled = [...allEmoji].sort(() => 0.5 - Math.random());
                      const selected = shuffled.slice(0, 10);
                      setBreakMemoryItems(selected);
                      setBreakMemoryTarget(selected[Math.floor(Math.random() * selected.length)]);
                      setBreakMode('memory-intro');
                      audioSynth.speak("Time for a quick memory break! Pay close attention to these objects.");
                      setTimeout(() => {
                         setBreakMode('memory-memorize');
                         setBreakTimeLeft(10);
                         if (breakTimerRef.current) clearInterval(breakTimerRef.current);
                         breakTimerRef.current = setInterval(() => {
                            setBreakTimeLeft(prev => {
                               if (prev <= 1) {
                                  clearInterval(breakTimerRef.current!);
                                  setBreakMode('memory-question');
                                  audioSynth.speak("Where was the " + breakMemoryTarget + "?");
                                  setBreakTimeLeft(10);
                                  breakTimerRef.current = setInterval(() => {
                                      setBreakTimeLeft(p => {
                                          if (p <= 1) {
                                              clearInterval(breakTimerRef.current!);
                                              setBreakMode('memory-reveal');
                                              audioSynth.playSwoosh();
                                              setTimeout(() => setBreakMode('menu'), 4000);
                                              return 0;
                                          }
                                          return p - 1;
                                      });
                                  }, 1000);
                                  return 0;
                               }
                               return prev - 1;
                            });
                         }, 1000);
                      }, 4000);
                  }} className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-2xl transition-all shadow-lg flex items-center justify-center gap-3">
                    <Brain className="w-8 h-8" /> Memory Break
                  </button>
                  <button onClick={() => {
                      setBreakRiddleIndex(Math.floor(Math.random() * breakRiddles.length));
                      setShowBreakRiddleAnswer(false);
                      setBreakMode('riddle');
                  }} className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-2xl transition-all shadow-lg flex items-center justify-center gap-3">
                    <Lightbulb className="w-8 h-8" /> Riddle Break
                  </button>
                  <button onClick={() => {
                      // Generate a simple 8x8 word search
                      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                      const words = ["REACT", "QUIZ", "BREAK", "FUN", "PLAY"];
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
                </div>
                <button onClick={() => { setBreakMode(null); setIsPaused(false); }} className="mt-8 px-8 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl transition-all border-2 border-slate-500">
                  Resume Quiz
                </button>
             </div>
           )}

           {breakMode === 'riddle' && (
             <div className="w-full max-w-4xl bg-white/10 p-12 rounded-[3rem] border-4 border-white/20 shadow-2xl text-center">
                <Lightbulb className="w-20 h-20 text-yellow-400 mx-auto mb-8 animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-black text-white mb-12 leading-tight">
                  {breakRiddles[breakRiddleIndex].q}
                </h2>
                {!showBreakRiddleAnswer ? (
                  <button onClick={() => setShowBreakRiddleAnswer(true)} className="px-10 py-5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-3xl transition-all shadow-xl hover:scale-105 active:scale-95">
                    Reveal Answer
                  </button>
                ) : (
                  <div className="mt-8 animate-in zoom-in duration-300">
                    <p className="text-6xl font-black text-emerald-400 drop-shadow-lg mb-10">{breakRiddles[breakRiddleIndex].a}</p>
                    <button onClick={() => setBreakMode('menu')} className="px-8 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl transition-all">
                      Back to Menu
                    </button>
                  </div>
                )}
             </div>
           )}

           {breakMode === 'word-search' && (
             <div className="w-full max-w-5xl bg-white/10 p-8 rounded-[3rem] border-4 border-white/20 shadow-2xl flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-white mb-6 text-center">Find these words!</h2>
                  <div className="flex flex-wrap justify-center gap-3">
                    {breakWordSearchWords.map((w, idx) => (
                      <span key={idx} className={\`px-4 py-2 rounded-lg font-bold text-xl \${w.found ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}\`}>
                        {w.word}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <button onClick={() => setBreakMode('menu')} className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg transition-all">
                      Back to Menu
                    </button>
                  </div>
                </div>
                <div className="flex-shrink-0 grid grid-cols-8 gap-1 p-2 bg-slate-800 rounded-2xl" onMouseLeave={() => setBreakWsCurrentSelection([])}>
                  {breakWordSearchGrid.map((row, r) => (
                    row.map((cell, c) => {
                      const isSelected = breakWsCurrentSelection.some(pos => pos.r === r && pos.c === c);
                      return (
                        <div 
                          key={\`\${r}-\${c}\`}
                          onMouseDown={(e) => { e.preventDefault(); setBreakWsStartNode({r, c}); setBreakWsCurrentSelection([{r, c}]); }}
                          onMouseEnter={() => {
                            if (breakWsStartNode) {
                               // basic horiz/vert line logic
                               const sel = [];
                               if (r === breakWsStartNode.r) {
                                  const min = Math.min(c, breakWsStartNode.c);
                                  const max = Math.max(c, breakWsStartNode.c);
                                  for(let i=min; i<=max; i++) sel.push({r, c: i});
                               } else if (c === breakWsStartNode.c) {
                                  const min = Math.min(r, breakWsStartNode.r);
                                  const max = Math.max(r, breakWsStartNode.r);
                                  for(let i=min; i<=max; i++) sel.push({r: i, c});
                               }
                               if (sel.length > 0) setBreakWsCurrentSelection(sel);
                            }
                          }}
                          onMouseUp={() => {
                            if (breakWsCurrentSelection.length > 0) {
                              const wordStr = breakWsCurrentSelection.map(pos => breakWordSearchGrid[pos.r][pos.c].char).join('');
                              const wordStrRev = wordStr.split('').reverse().join('');
                              const wordIndex = breakWordSearchWords.findIndex(w => (w.word === wordStr || w.word === wordStrRev) && !w.found);
                              if (wordIndex !== -1) {
                                audioSynth.playCorrect();
                                setBreakWordSearchWords(prev => {
                                   const next = [...prev];
                                   next[wordIndex].found = true;
                                   return next;
                                });
                                setBreakWordSearchGrid(prev => {
                                   const next = [...prev];
                                   breakWsCurrentSelection.forEach(pos => {
                                      next[pos.r][pos.c].found = true;
                                   });
                                   return next;
                                });
                              }
                            }
                            setBreakWsStartNode(null);
                            setBreakWsCurrentSelection([]);
                          }}
                          className={\`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-2xl font-black rounded-lg cursor-pointer select-none transition-all \${cell.found ? 'bg-emerald-500 text-white scale-95 shadow-inner' : isSelected ? 'bg-indigo-500 text-white scale-110' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}\`}
                        >
                          {cell.char}
                        </div>
                      )
                    })
                  ))}
                </div>
             </div>
           )}

           {(breakMode === 'memory-intro' || breakMode === 'memory-memorize' || breakMode === 'memory-question' || breakMode === 'memory-reveal') && (
              <div className="w-[80vw] h-[80vh] max-w-none flex flex-col items-center justify-center">
                {breakMode === 'memory-intro' && (
                  <div className="text-center">
                    <div className="text-9xl mb-8 animate-bounce drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">🧩</div>
                    <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-6 tracking-wider">Memory Break!</h1>
                    <p className="text-2xl md:text-4xl font-bold text-indigo-200">How many of these objects can you remember?</p>
                  </div>
                )}
                {breakMode === 'memory-question' && (
                  <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-8">
                    Where was the <span className="text-yellow-300 text-6xl md:text-8xl inline-block mx-2 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)] animate-pulse">{breakMemoryTarget}</span> ?
                  </h2>
                )}
                {breakMode === 'memory-memorize' && (
                  <>
                    <div className="absolute top-8 right-8 text-6xl font-black text-white bg-black/40 px-6 py-4 rounded-3xl backdrop-blur-md">
                      {breakTimeLeft}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-8 uppercase tracking-widest">
                      Take a close look at these objects!
                    </h2>
                  </>
                )}
                {breakMode === 'memory-reveal' && (
                  <h2 className="text-4xl md:text-6xl font-black text-emerald-400 drop-shadow-lg mb-8 uppercase tracking-widest">
                    There it is!
                  </h2>
                )}
                
                {breakMode !== 'memory-intro' && (
                  <div className="grid grid-cols-5 grid-rows-2 gap-6 md:gap-8 w-full flex-1 min-h-0">
                    {breakMemoryItems.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (breakMode === 'memory-question') {
                            if (item === breakMemoryTarget) {
                              if (breakTimerRef.current) clearInterval(breakTimerRef.current);
                              setBreakMode('memory-reveal');
                              audioSynth.playSwoosh();
                              setTimeout(() => setBreakMode('menu'), 4000);
                            } else {
                              audioSynth.playWrong();
                            }
                          }
                        }}
                        className={\`bg-white/10 backdrop-blur-md border-4 border-white/20 rounded-[2.5rem] w-full h-full flex items-center justify-center text-[6rem] md:text-[8rem] lg:text-[10rem] shadow-2xl relative \${breakMode === 'memory-question' ? 'cursor-pointer hover:bg-white/20 hover:scale-105 active:scale-95 transition-all' : ''}\`}
                      >
                        {(breakMode === 'memory-memorize' || breakMode === 'memory-reveal') ? (
                          <span className={\`transition-all \${breakMode === 'memory-reveal' && item === breakMemoryTarget ? 'scale-125 animate-bounce drop-shadow-[0_0_50px_rgba(52,211,153,1)] z-50' : breakMode === 'memory-reveal' ? 'opacity-20 blur-sm' : ''}\`}>{item}</span>
                        ) : (
                          <span className="text-white/20">?</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
           )}
        </div>
      )}
`;
code = code.replace(renderTarget, renderReplace);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Patched Presentation with Break logic");
