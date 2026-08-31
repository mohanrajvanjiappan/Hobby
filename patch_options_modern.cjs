const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const target = `                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={isReveal && isCorrect ? { scale: [1, 1.05, 1], opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
                        transition={isReveal && isCorrect ? { repeat: Infinity, duration: 1.5 } : { delay: i * 0.1, type: "spring", stiffness: 100 }}`;

const replacement = `                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={isReveal && isCorrect ? { 
                          scale: [1, 1.03, 1], 
                          opacity: 1, 
                          y: 0,
                          boxShadow: ["0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 0 40px 10px rgba(16,185,129,0.6)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)"]
                        } : { opacity: 1, y: 0, scale: 1 }}
                        transition={isReveal && isCorrect ? { 
                          repeat: Infinity, 
                          duration: 2,
                          ease: "easeInOut" 
                        } : { delay: i * 0.1, type: "spring", stiffness: 100 }}`;

code = code.replace(target, replacement);

const targetClass = `className={\`px-6 py-4 rounded-3xl text-2xl md:text-3xl lg:text-4xl font-black shadow-xl flex items-center gap-4 transform transition-all \${cardClass}\`}`;

const replaceClass = `className={\`relative overflow-hidden px-6 py-4 rounded-3xl text-2xl md:text-3xl lg:text-4xl font-black flex items-center gap-4 transform transition-all \${cardClass}\`}
                      >
                        {isReveal && isCorrect && (
                          <motion.div
                            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                            initial={{ x: '-150%' }}
                            animate={{ x: '150%' }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1 }}
                          />
                        )}
                        <div className={\`relative z-10 w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full flex items-center justify-center font-black text-3xl md:text-4xl shadow-inner \${isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-slate-100 text-slate-500'}\`}>
                          {optionLetters[i]}
                        </div>
                        <span className="relative z-10 leading-tight">{option}</span>
                      </motion.div>
                    );`;

// Wait, the original has:
// className={`px-6 py-4 rounded-3xl text-2xl md:text-3xl lg:text-4xl font-black shadow-xl flex items-center gap-4 transform transition-all ${cardClass}`}
// >
//   <div className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full flex items-center justify-center font-black text-3xl md:text-4xl shadow-inner ${isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
//     {optionLetters[i]}
//   </div>
//   <span className="leading-tight">{option}</span>
// </motion.div>

code = code.replace(
  /className=\{`px-6 py-4 rounded-3xl text-2xl md:text-3xl lg:text-4xl font-black shadow-xl flex items-center gap-4 transform transition-all \$\{cardClass\}`\}\s*>\s*<div className=\{`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full flex items-center justify-center font-black text-3xl md:text-4xl shadow-inner \$\{isReveal && isCorrect \? 'bg-white text-emerald-600' : 'bg-slate-100 text-slate-500'\}`\}>\s*\{optionLetters\[i\]\}\s*<\/div>\s*<span className="leading-tight">\{option\}<\/span>\s*<\/motion.div>/g,
  replaceClass
);

fs.writeFileSync('src/components/Presentation.tsx', code);
