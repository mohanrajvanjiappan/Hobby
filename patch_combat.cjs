const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const targetLeft = `<motion.div key={\`l-\${i}\`} className={\`px-6 py-5 rounded-3xl text-xl md:text-2xl font-bold flex items-center gap-4 transition-all duration-300 transform active:scale-95 \$\{cardClass\} shadow-md\`}>
                          <div className={\`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-lg \$\{isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-slate-200 text-slate-600'\}\`}>
                            {optionLetters[i]}
                          </div>
                          <span className="leading-tight">{option}</span>
                        </motion.div>`;

const replaceLeft = `<motion.div 
                          key={\`l-\${i}\`} 
                          animate={isReveal && isCorrect ? { 
                            scale: [1, 1.03, 1], 
                            boxShadow: ["0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 0 30px 10px rgba(16,185,129,0.6)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)"]
                          } : { scale: 1 }}
                          transition={isReveal && isCorrect ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
                          className={\`relative overflow-hidden px-6 py-5 rounded-3xl text-xl md:text-2xl font-bold flex items-center gap-4 transition-all duration-300 transform active:scale-95 \$\{cardClass\} shadow-md\`}>
                          {isReveal && isCorrect && (
                            <motion.div
                              className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                              initial={{ x: '-150%' }}
                              animate={{ x: '150%' }}
                              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1 }}
                            />
                          )}
                          <div className={\`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-lg \$\{isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-slate-200 text-slate-600'\}\`}>
                            {optionLetters[i]}
                          </div>
                          <span className="relative z-10 leading-tight">{option}</span>
                        </motion.div>`;

const targetRight = `<motion.div key={\`r-\${i}\`} className={\`px-6 py-5 rounded-3xl text-xl md:text-2xl font-bold flex items-center gap-4 transition-all duration-300 transform active:scale-95 \$\{cardClass\} shadow-md\`}>
                          <div className={\`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-lg \$\{isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-slate-200 text-slate-600'\}\`}>
                            {optionLetters[i]}
                          </div>
                          <span className="leading-tight">{option}</span>
                        </motion.div>`;

const replaceRight = `<motion.div 
                          key={\`r-\${i}\`} 
                          animate={isReveal && isCorrect ? { 
                            scale: [1, 1.03, 1], 
                            boxShadow: ["0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 0 30px 10px rgba(16,185,129,0.6)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)"]
                          } : { scale: 1 }}
                          transition={isReveal && isCorrect ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
                          className={\`relative overflow-hidden px-6 py-5 rounded-3xl text-xl md:text-2xl font-bold flex items-center gap-4 transition-all duration-300 transform active:scale-95 \$\{cardClass\} shadow-md\`}>
                          {isReveal && isCorrect && (
                            <motion.div
                              className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                              initial={{ x: '-150%' }}
                              animate={{ x: '150%' }}
                              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1 }}
                            />
                          )}
                          <div className={\`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-lg \$\{isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-slate-200 text-slate-600'\}\`}>
                            {optionLetters[i]}
                          </div>
                          <span className="relative z-10 leading-tight">{option}</span>
                        </motion.div>`;

code = code.replace(targetLeft, replaceLeft);
code = code.replace(targetRight, replaceRight);

fs.writeFileSync('src/components/Presentation.tsx', code);
