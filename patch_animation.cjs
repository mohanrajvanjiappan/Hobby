const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

code = code.replace(
  /initial=\{\{ opacity: 0, x: currentQuestionIndex % 2 === 0 \? '100vw' : '-100vw', scale: 0\.8, rotateY: currentQuestionIndex % 2 === 0 \? 45 : -45 \}\}/,
  "initial={{ opacity: 0, x: currentQuestionIndex % 2 === 0 ? '120vw' : '-120vw', y: 100, rotateZ: currentQuestionIndex % 2 === 0 ? 15 : -15, scale: 0.5 }}"
);

code = code.replace(
  /animate=\{\{ opacity: 1, x: 0, scale: 1, rotateY: 0 \}\}/,
  "animate={{ opacity: 1, x: 0, y: 0, rotateZ: 0, scale: 1 }}"
);

code = code.replace(
  /exit=\{\{ opacity: 0, x: currentQuestionIndex % 2 === 0 \? '-100vw' : '100vw', scale: 1\.2, rotateY: currentQuestionIndex % 2 === 0 \? -45 : 45 \}\}/,
  "exit={{ opacity: 0, x: currentQuestionIndex % 2 === 0 ? '-120vw' : '120vw', y: -100, rotateZ: currentQuestionIndex % 2 === 0 ? -15 : 15, scale: 0.8 }}"
);

code = code.replace(
  /transition=\{\{ type: "spring", stiffness: 90, damping: 20, mass: 1 \}\}/,
  'transition={{ type: "spring", stiffness: 100, damping: 16, mass: 1 }}'
);

// Also replace the timer progress bar.
const oldTimerCode = `{stage !== 'reveal' && (
              <div className="mt-auto pt-6 w-full max-w-5xl mx-auto z-20 shrink-0">
                <div className="h-6 md:h-8 bg-slate-900/10 rounded-full overflow-hidden p-1 backdrop-blur-xl border-[4px] border-white/60 shadow-inner relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-black text-sm md:text-base tracking-widest z-10 drop-shadow-md">
                    {timeLeft} SECONDS LEFT
                  </div>
                  <motion.div
                    className={\`h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] \${timeLeft <= 5 ? 'bg-gradient-to-r from-rose-400 to-red-500 animate-pulse' : 'bg-gradient-to-r from-amber-300 to-amber-500'}\`}
                    initial={{ width: '100%' }}
                    animate={{ width: \`\${(timeLeft / (currentType === 'detective' || currentType === 'match-the-following' || currentType === 'word-search' ? (question.timeLimit || 30) : currentType === '5-clues' || currentType === 'find-in-map' || currentType === 'jumbled-letters' ? (question.timeLimit || 25) : quiz.type === 'rapid-fire' ? (question.timeLimit || quiz.timeLimit || 60) : (question.timeLimit || 15))) * 100}%\` }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </div>
              </div>
            )}`;

const newTimerCode = `{stage !== 'reveal' && (
              <div className="mt-auto pt-6 w-full max-w-6xl mx-auto z-20 shrink-0 pb-4">
                <div className="relative flex items-center justify-center">
                  {/* Graphical Time Left Icon/Badge */}
                  <motion.div
                    className={\`absolute left-0 -ml-4 md:-ml-6 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-[4px] shadow-[0_0_30px_rgba(0,0,0,0.3)] z-30 \${timeLeft <= 5 ? 'bg-red-500 border-red-200 text-white animate-pulse' : 'bg-white border-indigo-200 text-indigo-600'}\`}
                    animate={{ rotate: timeLeft <= 5 ? [0, -15, 15, -15, 15, 0] : [0, -5, 5, -5, 5, 0], scale: timeLeft <= 5 ? [1, 1.1, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: timeLeft <= 5 ? 0.5 : 2, ease: "easeInOut" }}
                  >
                    <Clock className={\`w-8 h-8 md:w-10 md:h-10 \${timeLeft <= 5 ? 'text-white' : 'text-indigo-600'}\`} />
                  </motion.div>

                  <div className="w-full h-10 md:h-14 bg-black/30 rounded-full overflow-hidden p-1.5 backdrop-blur-xl border-[4px] border-white/60 shadow-inner relative ml-8 md:ml-12 flex-1">
                    <div className="absolute inset-0 flex items-center justify-center text-white font-black text-lg md:text-xl tracking-widest z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {timeLeft} SECONDS LEFT
                    </div>
                    <motion.div
                      className={\`h-full rounded-full shadow-[0_0_25px_rgba(255,255,255,0.8)] relative overflow-hidden \${timeLeft <= 5 ? 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600' : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600'}\`}
                      initial={{ width: '100%' }}
                      animate={{ width: \`\${(timeLeft / (currentType === 'detective' || currentType === 'match-the-following' || currentType === 'word-search' ? (question.timeLimit || 30) : currentType === '5-clues' || currentType === 'find-in-map' || currentType === 'jumbled-letters' ? (question.timeLimit || 25) : quiz.type === 'rapid-fire' ? (question.timeLimit || quiz.timeLimit || 60) : (question.timeLimit || 15))) * 100}%\` }}
                      transition={{ duration: 1, ease: 'linear' }}
                    >
                      {/* Inner striped/shimmer effect */}
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wLDQwIEw0MCwwIE0wLDIwIEwyMCwwIE0yMCw0MCBMNDAsMjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iNCIgb3BhY2l0eT0iMC4yIi8+Cjwvc3ZnPg==')] animate-slide-stripe" />
                    </motion.div>
                  </div>
                </div>
              </div>
            )}`;

code = code.replace(oldTimerCode, newTimerCode);
fs.writeFileSync('src/components/Presentation.tsx', code);
