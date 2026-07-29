const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldDet = `                  if (isReveal) {
                    if (isFake) {
                      itemClass = "bg-rose-500 text-white border-l-8 border-rose-700 shadow-[0_0_30px_rgba(244,63,94,0.6)] scale-[1.02]";
                      numClass = "bg-white text-rose-600";
                    } else {
                      itemClass = "bg-white text-slate-400 border-l-8 border-slate-200 opacity-50";
                      numClass = "bg-slate-100 text-slate-400";
                    }
                  }
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={\`px-4 py-3 md:px-6 md:py-4 rounded-2xl text-xl md:text-2xl font-bold flex items-center gap-4 transform transition-all \${itemClass}\`}
                    >`;

const newDet = `                  if (quiz.mode === 'interactive' && !isReveal) {
                    itemClass += " cursor-pointer hover:bg-slate-50 active:scale-95";
                  } else if (isReveal) {
                    if (quiz.mode === 'interactive' && interactiveOptionClicked) {
                      const wasClicked = interactiveOptionClicked === sentence;
                      if (wasClicked) {
                        if (isFake) {
                          itemClass = "bg-emerald-500 text-white border-l-8 border-emerald-700 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.02]";
                          numClass = "bg-white text-emerald-600";
                        } else {
                          itemClass = "bg-rose-500 text-white border-l-8 border-rose-700 shadow-[0_0_30px_rgba(244,63,94,0.6)] scale-[1.02]";
                          numClass = "bg-white text-rose-600";
                        }
                      } else if (isFake) {
                        itemClass = "bg-emerald-500 text-white border-l-8 border-emerald-700 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.02]";
                        numClass = "bg-white text-emerald-600";
                      } else {
                        itemClass = "bg-white text-slate-400 border-l-8 border-slate-200 opacity-50";
                        numClass = "bg-slate-100 text-slate-400";
                      }
                    } else {
                      if (isFake) {
                        itemClass = "bg-rose-500 text-white border-l-8 border-rose-700 shadow-[0_0_30px_rgba(244,63,94,0.6)] scale-[1.02]";
                        numClass = "bg-white text-rose-600";
                      } else {
                        itemClass = "bg-white text-slate-400 border-l-8 border-slate-200 opacity-50";
                        numClass = "bg-slate-100 text-slate-400";
                      }
                    }
                  }
                  
                  return (
                    <motion.div
                      key={i}
                      onClick={() => {
                        if (quiz.mode === 'interactive' && !isReveal) {
                          if (timerRef.current) clearInterval(timerRef.current);
                          setInteractiveOptionClicked(sentence);
                          if (isFake) {
                            setScore(s => s + 1);
                            audioSynth.playCorrect();
                          } else {
                            audioSynth.playWrong();
                          }
                          window.speechSynthesis.cancel();
                          setStage('reveal');
                        }
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={\`px-4 py-3 md:px-6 md:py-4 rounded-2xl text-xl md:text-2xl font-bold flex items-center gap-4 transform transition-all \${itemClass}\`}
                    >`;

content = content.replace(oldDet, newDet);
fs.writeFileSync('src/components/Presentation.tsx', content);
