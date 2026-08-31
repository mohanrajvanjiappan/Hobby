import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const targetWords = `                      const words = ["REACT", "QUIZ", "BREAK", "FUN", "PLAY"];`;
const replaceWords = `                      const allWordsPool = ["REACT", "QUIZ", "BREAK", "FUN", "PLAY", "GAME", "CODE", "TIME", "FAST", "SMART", "NERD", "GEEK", "COOL", "WINS", "LAUGH"];
                      const words = [...allWordsPool].sort(() => 0.5 - Math.random()).slice(0, 5);`;

code = code.replace(targetWords, replaceWords);

const targetMemory = `                        className={\`bg-white/10 backdrop-blur-md border-4 border-white/20 rounded-[2.5rem] w-full h-full flex items-center justify-center text-[6rem] md:text-[8rem] lg:text-[10rem] shadow-2xl relative \${breakMode === 'memory-question' ? 'cursor-pointer hover:bg-white/20 hover:scale-105 active:scale-95 transition-all' : ''}\`}
                      >
                        {(breakMode === 'memory-memorize' || breakMode === 'memory-reveal') ? (
                          <span className={\`transition-all \${breakMode === 'memory-reveal' && item === breakMemoryTarget ? 'scale-125 animate-bounce drop-shadow-[0_0_50px_rgba(52,211,153,1)] z-50' : breakMode === 'memory-reveal' ? 'opacity-20 blur-sm' : ''}\`}>{item}</span>
                        ) : (
                          <span className="text-white/20">?</span>
                        )}
                      </div>`;
const replaceMemory = `                        className={\`bg-white/10 backdrop-blur-md border-4 border-white/20 rounded-[2.5rem] w-full h-full flex items-center justify-center text-[6rem] md:text-[8rem] lg:text-[10rem] shadow-2xl relative \${breakMode === 'memory-question' ? 'cursor-pointer hover:bg-white/20 hover:scale-105 active:scale-95 transition-all' : ''}\`}
                      >
                        <div className="absolute top-2 right-4 text-2xl md:text-3xl font-black text-white/50">{idx + 1}</div>
                        {(breakMode === 'memory-memorize' || breakMode === 'memory-reveal') ? (
                          <span className={\`transition-all \${breakMode === 'memory-reveal' && item === breakMemoryTarget ? 'scale-125 animate-bounce drop-shadow-[0_0_50px_rgba(52,211,153,1)] z-50' : breakMode === 'memory-reveal' ? 'opacity-20 blur-sm' : ''}\`}>{item}</span>
                        ) : (
                          <span className="text-white/20">?</span>
                        )}
                      </div>`;

if (!code.includes(targetMemory)) {
    console.error("Target Memory not found!");
}

code = code.replace(targetMemory, replaceMemory);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Patched Presentation with Memory Numbers and Word Search Words!");
