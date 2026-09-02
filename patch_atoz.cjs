const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /\{\!isJumbledLetters && currentType \!\=\= 'text-presentation'/;

const newCode = `{currentType === 'a-to-z' && (
              <div className="w-full flex flex-col items-center justify-center relative z-10 my-4 md:my-8">
                {(() => {
                  const match = question.question.match(/letter\\s+([A-Z])/i);
                  const letter = match ? match[1].toUpperCase() : (question.question.trim().slice(-1).toUpperCase());
                  
                  return (
                    <div className="flex flex-col items-center relative w-full max-w-5xl mx-auto">
                      <motion.div 
                        initial={{ scale: 0, rotateY: -180, opacity: 0 }}
                        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                        transition={{ type: 'spring', bounce: 0.6, duration: 1.5 }}
                        whileHover={{ scale: 1.05, rotateZ: (Math.random() - 0.5) * 5 }}
                        className="w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(245,158,11,0.4)] border-[10px] md:border-[16px] border-white/80 flex items-center justify-center mb-8 relative z-20 overflow-hidden"
                      >
                         <motion.div 
                           className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                           animate={{ x: ['-200%', '200%'] }}
                           transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                         />
                         <span className="text-[6rem] md:text-[10rem] font-black text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] leading-none">{letter}</span>
                      </motion.div>

                      <AnimatePresence>
                        {stage === 'reveal' && (
                          <motion.div
                            initial={{ scale: 0.8, y: -40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
                            className="w-full px-8 py-8 md:px-12 md:py-10 bg-white/95 backdrop-blur-xl border-b-[12px] border-emerald-500 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] text-center relative z-10"
                          >
                             <h3 className="text-xl md:text-2xl text-emerald-600 font-black uppercase tracking-widest mb-4 flex items-center justify-center gap-3">
                               <Award className="w-8 h-8" /> Correct Answer
                             </h3>
                             <p className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-800 tracking-tight leading-tight mb-2">{question.correctAnswer}</p>
                             {question.insight && (
                               <div className="mt-8 px-6 py-5 md:px-8 md:py-6 bg-emerald-50 rounded-[2rem] border-4 border-emerald-100 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                                 <div className="w-14 h-14 shrink-0 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner">
                                   <Lightbulb className="w-8 h-8 text-emerald-500" />
                                 </div>
                                 <p className="text-lg md:text-2xl text-slate-700 font-bold leading-relaxed">{question.insight}</p>
                               </div>
                             )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })()}
              </div>
            )}

            {!isJumbledLetters && currentType !== 'a-to-z' && currentType !== 'text-presentation'`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Presentation.tsx', code);
