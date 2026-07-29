const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldOpts = `                    let cardClass = "bg-white text-slate-800 border-b-8 border-slate-300";
                    if (isReveal) {
                      if (isCorrect) {
                        cardClass = "bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)]";
                      } else {
                        cardClass = "bg-white text-slate-400 border-b-8 border-slate-200 opacity-60";
                      }
                    }

                    return (
                      <motion.div
                        key={i}
                        animate={isReveal && isCorrect ? { scale: [1, 1.05, 1] } : {}}
                        transition={isReveal && isCorrect ? { repeat: Infinity, duration: 1.5 } : {}}
                        className={\`px-8 py-6 rounded-3xl text-3xl md:text-4xl lg:text-5xl font-black shadow-2xl flex items-center gap-8 transform transition-all \${cardClass}\`}
                      >`;

const newOpts = `                    let cardClass = "bg-white text-slate-800 border-b-8 border-slate-300";
                    if (quiz.mode === 'interactive' && !isReveal) {
                      cardClass += " cursor-pointer hover:bg-slate-50 active:scale-95";
                    } else if (isReveal) {
                      if (quiz.mode === 'interactive' && interactiveOptionClicked) {
                        if (option === interactiveOptionClicked) {
                          if (isCorrect) {
                            cardClass = "bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)]";
                          } else {
                            cardClass = "bg-rose-500 text-white border-b-8 border-rose-700 shadow-[0_0_50px_rgba(244,63,94,0.8)]";
                          }
                        } else if (isCorrect) {
                           cardClass = "bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)]";
                        } else {
                           cardClass = "bg-white text-slate-400 border-b-8 border-slate-200 opacity-60";
                        }
                      } else {
                        if (isCorrect) {
                          cardClass = "bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)]";
                        } else {
                          cardClass = "bg-white text-slate-400 border-b-8 border-slate-200 opacity-60";
                        }
                      }
                    }

                    return (
                      <motion.div
                        key={i}
                        onClick={() => {
                          if (quiz.mode === 'interactive' && !isReveal) {
                            if (timerRef.current) clearInterval(timerRef.current);
                            setInteractiveOptionClicked(option);
                            if (isCorrect) {
                              setScore(s => s + 1);
                              audioSynth.playCorrect();
                            } else {
                              audioSynth.playWrong();
                            }
                            window.speechSynthesis.cancel();
                            setStage('reveal');
                          }
                        }}
                        animate={isReveal && isCorrect ? { scale: [1, 1.05, 1] } : {}}
                        transition={isReveal && isCorrect ? { repeat: Infinity, duration: 1.5 } : {}}
                        className={\`px-8 py-6 rounded-3xl text-3xl md:text-4xl lg:text-5xl font-black shadow-2xl flex items-center gap-8 transform transition-all \${cardClass}\`}
                      >`;

content = content.replace(oldOpts, newOpts);
fs.writeFileSync('src/components/Presentation.tsx', content);
