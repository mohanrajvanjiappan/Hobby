const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /<div className="grid grid-cols-5 gap-4 md:gap-6 w-full">([\s\S]*?)<\/div>\s*\{stage !== 'memory-break-reveal'/;

const newMemory = `
                <div className="grid gap-4 md:gap-8 justify-center items-center content-center w-full flex-1 min-h-0 py-4" style={{ gridTemplateColumns: \`repeat(\${Math.ceil(memoryItems.length / 2)}, minmax(0, auto))\` }}>
                  {memoryItems.map((item, idx) => {
                    const count = memoryItems.length;
                    const sizeClass = count <= 6 ? 'w-36 h-36 md:w-56 md:h-56 text-[6rem] md:text-[8rem]' : count <= 10 ? 'w-32 h-32 md:w-48 md:h-48 text-[5rem] md:text-[7rem]' : count <= 15 ? 'w-28 h-28 md:w-40 md:h-40 text-[4rem] md:text-[6rem]' : 'w-24 h-24 md:w-32 md:h-32 text-[3.5rem] md:text-[5rem]';
                    return (
                    <motion.div
                      key={idx}
                      className={\`bg-white/10 backdrop-blur-md border-4 border-white/20 rounded-3xl flex items-center justify-center shadow-2xl relative cursor-pointer \${sizeClass}\`}
                      animate={
                        stage === 'memory-break-reveal' && item === memoryTarget 
                        ? { scale: [1, 1.1, 1], borderColor: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.4)' } 
                        : {}
                      }
                      transition={{ repeat: stage === 'memory-break-reveal' && item === memoryTarget ? Infinity : 0, duration: 1 }}
                      onClick={() => {
                        if (stage === 'memory-break-question') {
                          // Allow interactive click to reveal
                          if (item === memoryTarget) {
                            setStage('memory-break-reveal');
                          }
                        }
                      }}
                    >
                      {stage === 'memory-break-question' ? (
                        <span className="text-white/50 text-5xl md:text-7xl font-black drop-shadow-md">?</span>
                      ) : (
                        <span className={\`drop-shadow-[0_0_15px_rgba(0,0,0,0.3)] \${stage === 'memory-break-reveal' && item !== memoryTarget ? "opacity-20 grayscale" : "opacity-100"}\`}>{item}</span>
                      )}
                    </motion.div>
                  );
                  })}
                </div>
                
                {stage !== 'memory-break-reveal'`;

code = code.replace(regex, newMemory);
fs.writeFileSync('src/components/Presentation.tsx', code);
