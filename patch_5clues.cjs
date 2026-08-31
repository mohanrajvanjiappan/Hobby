const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const target = `                        className={\`px-4 py-3 rounded-2xl text-2xl md:text-3xl lg:text-4xl font-bold flex items-center gap-4 transition-all duration-500 \$\{optClass\}\`}>
                        <div className={\`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full flex items-center justify-center font-black text-xl md:text-2xl shadow-inner \$\{isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-white text-slate-500'\}\`}>
                          {optionLetters[i]}
                        </div>
                        <span className="leading-tight truncate" title={option}>{option}</span>
                      </div>
                    );
                  })}
                </div>
              )}`;

const replacement = `                        animate={isReveal && isCorrect ? { 
                          scale: [1, 1.03, 1], 
                          boxShadow: ["0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 0 40px 10px rgba(16,185,129,0.6)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)"]
                        } : { scale: 1 }}
                        transition={isReveal && isCorrect ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
                        className={\`relative overflow-hidden px-4 py-3 rounded-2xl text-2xl md:text-3xl lg:text-4xl font-bold flex items-center gap-4 transition-all duration-500 \$\{optClass\}\`}>
                        {isReveal && isCorrect && (
                          <motion.div
                            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                            initial={{ x: '-150%' }}
                            animate={{ x: '150%' }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1 }}
                          />
                        )}
                        <div className={\`relative z-10 w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full flex items-center justify-center font-black text-xl md:text-2xl shadow-inner \$\{isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-white text-slate-500'\}\`}>
                          {optionLetters[i]}
                        </div>
                        <span className="relative z-10 leading-tight truncate" title={option}>{option}</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}`;

// Wait, the tag before className=... is <div ... I need to change it to <motion.div
code = code.replace(
  /<div key=\{i\}\s*onClick=\{\(\) => \{/g, 
  '<motion.div key={i} \n                        onClick={() => {'
);
code = code.replace(target, replacement);

fs.writeFileSync('src/components/Presentation.tsx', code);
