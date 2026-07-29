const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldOpts = `                    let optClass = "bg-slate-100 text-slate-700 border-2 border-slate-200";
                    if (isReveal) {
                      if (isCorrect) optClass = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg scale-[1.02]";
                      else optClass = "bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-50";
                    }
                    return (
                      <div key={i} className={\`px-6 py-5 rounded-2xl text-2xl md:text-3xl font-bold flex items-center gap-4 transition-all duration-500 \${optClass}\`}>`;

const newOpts = `                    let optClass = "bg-slate-100 text-slate-700 border-2 border-slate-200";
                    if (quiz.mode === 'interactive' && !isReveal) {
                      optClass += " cursor-pointer hover:bg-white active:scale-95";
                    } else if (isReveal) {
                      if (quiz.mode === 'interactive' && interactiveOptionClicked) {
                        if (option === interactiveOptionClicked) {
                          if (isCorrect) {
                            optClass = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-[0_0_50px_rgba(16,185,129,0.8)] scale-[1.02]";
                          } else {
                            optClass = "bg-rose-500 text-white border-2 border-rose-600 shadow-[0_0_50px_rgba(244,63,94,0.8)] scale-[1.02]";
                          }
                        } else if (isCorrect) {
                          optClass = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg scale-[1.02]";
                        } else {
                          optClass = "bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-50";
                        }
                      } else {
                        if (isCorrect) optClass = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg scale-[1.02]";
                        else optClass = "bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-50";
                      }
                    }
                    return (
                      <div key={i} 
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
                        className={\`px-6 py-5 rounded-2xl text-2xl md:text-3xl font-bold flex items-center gap-4 transition-all duration-500 \${optClass}\`}>`;

content = content.replace(oldOpts, newOpts);
fs.writeFileSync('src/components/Presentation.tsx', content);
