const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const cluesRegex = /\{\(currentType === '5-clues' \|\| question\.type === '5-clues'\) && !isJumbledLetters && \([\s\S]*?<\/div>\n\s*\)\}/;

const newClues = `{(currentType === '5-clues' || question.type === '5-clues') && !isJumbledLetters && (
              <div className="flex-1 w-full shrink-0 mb-6 flex flex-col gap-3 md:gap-4 relative px-4 z-10">
                {question.clues?.map((clue, i) => {
                  const isVisible = i <= clueIndex || stage === 'reveal';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -100, rotateY: -20, scale: 0.8 }}
                      animate={isVisible ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : { opacity: 0, x: -100, rotateY: -20, scale: 0.8 }}
                      transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                      className={\`px-6 py-4 md:px-8 md:py-6 rounded-3xl text-xl md:text-3xl font-bold shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex items-center gap-6 transform transition-all \${isVisible ? 'bg-white/95 backdrop-blur-xl text-slate-800 border-l-[12px] border-indigo-500' : 'hidden'}\`}
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl md:text-3xl shadow-[0_0_20px_rgba(99,102,241,0.5)] border-4 border-indigo-200">
                        {i + 1}
                      </div>
                      <span className="leading-snug tracking-tight relative z-10">{clue}</span>
                      
                      {/* Decorative background element for clue card */}
                      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-indigo-50/50 to-transparent rounded-r-3xl pointer-events-none" />
                    </motion.div>
                  );
                })}
                {stage === 'reveal' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
                    className="mt-6 px-8 py-6 rounded-[2rem] bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-b-[12px] border-emerald-800 shadow-[0_20px_50px_rgba(16,185,129,0.5)] text-3xl md:text-5xl font-black text-center relative overflow-hidden"
                  >
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 blur-3xl rounded-full" />
                    <span className="relative z-10">Answer: {question.correctAnswer}</span>
                  </motion.div>
                )}
              </div>
            )}`;

code = code.replace(cluesRegex, newClues);

const combatRegex = /\{quiz\.type === 'combat-mode' \? \([\s\S]*?\) : \(/;

const newCombat = `{quiz.type === 'combat-mode' ? (
              <div className="flex-1 w-full flex flex-col md:flex-row gap-8 md:gap-12 overflow-hidden mb-6 z-10 relative px-4 py-8">
                {/* VS Badge */}
                <motion.div 
                   initial={{ scale: 0, opacity: 0, rotate: -180 }}
                   animate={{ scale: 1, opacity: 1, rotate: 0 }}
                   transition={{ duration: 0.8, type: 'spring', bounce: 0.6, delay: 0.5 }}
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center border-[8px] md:border-[12px] border-white shadow-[0_0_60px_rgba(239,68,68,0.8)] text-white font-black italic text-4xl md:text-6xl"
                >
                   VS
                </motion.div>

                {/* Left Player */}
                <motion.div 
                   initial={{ x: -100, opacity: 0, rotateY: -10 }}
                   animate={{ x: 0, opacity: 1, rotateY: 0 }}
                   transition={{ duration: 0.6, type: 'spring' }}
                   className="flex-1 flex flex-col bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] border-b-[16px] border-indigo-400 p-8 md:p-12 relative overflow-visible"
                >
                  <div className="absolute -top-16 -left-16 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
                  <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-transparent to-indigo-500/30" />
                  
                  <h3 className="text-indigo-600 font-black tracking-widest uppercase mb-4 text-2xl relative z-10 flex items-center gap-3 bg-indigo-50 inline-block px-6 py-2 rounded-full self-start shadow-inner border-2 border-indigo-100">
                    <Sparkles className="w-6 h-6" /> Player 1
                  </h3>
                  <h2 className="font-extrabold text-slate-800 text-3xl md:text-5xl lg:text-6xl leading-tight mb-8 drop-shadow-sm flex-1 relative z-10">
                    {question.combatLeft?.question}
                  </h2>
                  <div className="flex flex-col gap-4 w-full mt-auto relative z-10">
                    {question.combatLeft?.options?.map((option, i) => {
                      const isCorrect = option === question.combatLeft?.correctAnswer;
                      const isReveal = stage === 'reveal';
                      let cardClass = "bg-slate-100 text-slate-800 border-[6px] border-slate-200 hover:border-indigo-300";
                      if (isReveal) {
                        if (isCorrect) cardClass = "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-[6px] border-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.03]";
                        else cardClass = "bg-slate-50 text-slate-300 border-[6px] border-transparent opacity-50";
                      }
                      return (
                        <motion.div key={\`l-\${i}\`} className={\`px-6 py-4 rounded-3xl text-xl md:text-2xl font-bold flex items-center gap-5 transition-all duration-500 \${cardClass}\`}>
                          <div className={\`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-black text-xl shadow-inner \${isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-white text-slate-400'}\`}>
                            {['A','B','C','D'][i]}
                          </div>
                          <span className="leading-tight">{option}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
                
                {/* Right Player */}
                <motion.div 
                   initial={{ x: 100, opacity: 0, rotateY: 10 }}
                   animate={{ x: 0, opacity: 1, rotateY: 0 }}
                   transition={{ duration: 0.6, type: 'spring' }}
                   className="flex-1 flex flex-col bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] border-b-[16px] border-rose-400 p-8 md:p-12 relative overflow-visible"
                >
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-rose-500/20 blur-3xl rounded-full pointer-events-none" />
                  <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-transparent to-rose-500/30" />
                  
                  <h3 className="text-rose-600 font-black tracking-widest uppercase mb-4 text-2xl relative z-10 flex items-center gap-3 bg-rose-50 inline-block px-6 py-2 rounded-full self-start shadow-inner border-2 border-rose-100">
                    <Rocket className="w-6 h-6" /> Player 2
                  </h3>
                  <h2 className="font-extrabold text-slate-800 text-3xl md:text-5xl lg:text-6xl leading-tight mb-8 drop-shadow-sm flex-1 relative z-10">
                    {question.combatRight?.question}
                  </h2>
                  <div className="flex flex-col gap-4 w-full mt-auto relative z-10">
                    {question.combatRight?.options?.map((option, i) => {
                      const isCorrect = option === question.combatRight?.correctAnswer;
                      const isReveal = stage === 'reveal';
                      let cardClass = "bg-slate-100 text-slate-800 border-[6px] border-slate-200 hover:border-rose-300";
                      if (isReveal) {
                        if (isCorrect) cardClass = "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-[6px] border-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.03]";
                        else cardClass = "bg-slate-50 text-slate-300 border-[6px] border-transparent opacity-50";
                      }
                      return (
                        <motion.div key={\`r-\${i}\`} className={\`px-6 py-4 rounded-3xl text-xl md:text-2xl font-bold flex items-center gap-5 transition-all duration-500 \${cardClass}\`}>
                          <div className={\`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-black text-xl shadow-inner \${isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-white text-slate-400'}\`}>
                            {['A','B','C','D'][i]}
                          </div>
                          <span className="leading-tight">{option}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            ) : (`;

code = code.replace(combatRegex, newCombat);
fs.writeFileSync('src/components/Presentation.tsx', code);
