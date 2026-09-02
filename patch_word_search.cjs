const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /\{currentType === 'word-search' && question\.grid && \([\s\S]*?<\/div>\n\s*\)\}/;

const newCode = `{currentType === 'word-search' && question.grid && (
              <div className="w-full flex-1 flex flex-col items-center justify-center mt-2 mb-6 relative z-10">
                <div className="relative p-6 md:p-8 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-b-[16px] border-indigo-400 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/10 pointer-events-none" />
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-indigo-300 rounded-tl-[2.5rem] opacity-50 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-indigo-300 rounded-br-[2.5rem] opacity-50 pointer-events-none" />

                  <div className="grid grid-cols-10 gap-2 md:gap-3 relative z-10">
                    {question.grid.map((row, r) => (
                      row.map((cell, c) => {
                        let isHighlighted = false;
                        let highlightIndex = 0;
                        if (stage === 'reveal' && question.wordLocations) {
                          const wordLocIndex = question.wordLocations.findIndex(w => w.cells.some(cellPos => cellPos.r === r && cellPos.c === c));
                          if (wordLocIndex !== -1) {
                            isHighlighted = true;
                            highlightIndex = wordLocIndex;
                          }
                        }

                        // Colors for different words
                        const highlightColors = [
                          'from-emerald-400 to-emerald-600 border-emerald-700 shadow-emerald-500/50',
                          'from-rose-400 to-rose-600 border-rose-700 shadow-rose-500/50',
                          'from-amber-400 to-amber-600 border-amber-700 shadow-amber-500/50',
                          'from-cyan-400 to-cyan-600 border-cyan-700 shadow-cyan-500/50',
                          'from-fuchsia-400 to-fuchsia-600 border-fuchsia-700 shadow-fuchsia-500/50',
                        ];
                        const colorClass = isHighlighted ? highlightColors[highlightIndex % highlightColors.length] : 'from-slate-50 to-white border-slate-200 text-slate-700';

                        return (
                          <motion.div 
                            key={\`\${r}-\${c}\`} 
                            initial={{ scale: 0, opacity: 0, rotateX: -90 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            transition={{ delay: (r * 10 + c) * 0.015, type: 'spring', stiffness: 200, damping: 12 }}
                            whileHover={!isHighlighted ? { scale: 1.1, zIndex: 20, rotateZ: (Math.random() - 0.5) * 10, y: -4 } : {}}
                            className={\`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[4rem] lg:h-[4rem] flex items-center justify-center rounded-2xl text-2xl sm:text-3xl md:text-4xl lg:text-[2.2rem] font-black transition-all duration-500 border-b-[6px] md:border-b-[8px] bg-gradient-to-b \${isHighlighted ? \`text-white scale-110 z-10 shadow-[0_10px_25px_var(--tw-shadow-color)] \${colorClass}\` : \`\${colorClass} shadow-md\`}\`}
                          >
                             <span className={isHighlighted ? "drop-shadow-md" : ""}>{cell}</span>
                          </motion.div>
                        );
                      })
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {stage === 'reveal' && question.wordsToFind && (
                    <motion.div 
                      initial={{ opacity: 0, y: 40, scale: 0.9 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      transition={{ delay: 0.8, type: 'spring', bounce: 0.5 }}
                      className="mt-8 flex flex-wrap gap-4 justify-center max-w-4xl"
                    >
                      {question.wordsToFind.map((word, i) => {
                        const highlightColors = [
                          'text-emerald-700 bg-emerald-100 border-emerald-300',
                          'text-rose-700 bg-rose-100 border-rose-300',
                          'text-amber-700 bg-amber-100 border-amber-300',
                          'text-cyan-700 bg-cyan-100 border-cyan-300',
                          'text-fuchsia-700 bg-fuchsia-100 border-fuchsia-300',
                        ];
                        const colorClass = highlightColors[i % highlightColors.length];
                        return (
                          <motion.div 
                            key={word} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + i * 0.15 }}
                            className={\`px-6 py-3 font-black text-2xl md:text-3xl rounded-2xl shadow-lg border-b-[6px] uppercase tracking-widest flex items-center gap-3 \${colorClass}\`}
                          >
                            <Sparkles className="w-6 h-6 opacity-80" />
                            {word}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Presentation.tsx', code);
