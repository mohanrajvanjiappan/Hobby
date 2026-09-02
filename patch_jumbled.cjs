const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const jumbledRegex = /<div className=\{`flex flex-wrap gap-2 sm:gap-3 md:gap-4 \$\{quiz\.mode === 'interactive' \? 'justify-start' : 'justify-center'\} w-full`\}>([\s\S]*?)<\/div>\s*<\/div>\s*\)\}/;

const newJumbled = `<div className={\`flex flex-wrap gap-3 sm:gap-4 md:gap-6 \${quiz.mode === 'interactive' ? 'justify-start' : 'justify-center'} w-full relative z-10\`}>
                    {(() => {
                      const rawAnswer = question.correctAnswer || question.answer || question.word || question.correct_answer || question.brand_name || '';
                      const word = rawAnswer.replace(/\\s/g, '').toUpperCase();
                      const letterObjects = word.split('').map((char, i) => ({ char, id: i }));
                      const displayLetters = stage === 'reveal' ? letterObjects : jumbledLettersForQuestion;

                      return displayLetters.map((item, i) => (
                        <motion.div 
                          key={\`\${item.id}-\${i}\`}
                          layout
                          initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                          transition={{ delay: stage === 'reveal' ? i * 0.05 : i * 0.08, type: 'spring', stiffness: 200, damping: 15 }}
                          whileHover={{ scale: 1.05, y: -10, rotateZ: (Math.random() - 0.5) * 10 }}
                          className={\`w-16 h-22 sm:w-20 sm:h-28 md:w-28 md:h-36 lg:w-32 lg:h-40 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black border-b-[12px] md:border-b-[16px] uppercase z-10 transition-colors duration-500 \${stage === 'reveal' ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-emerald-800 shadow-[0_0_50px_rgba(16,185,129,0.8)]' : 'bg-gradient-to-b from-white to-slate-100 text-indigo-700 border-indigo-300 backdrop-blur-md'}\`}
                        >
                          <span className="drop-shadow-md relative z-10">{item.char}</span>
                          <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ));
                    })()}
                  </div>
                </div>
              )}`;

code = code.replace(jumbledRegex, newJumbled);
fs.writeFileSync('src/components/Presentation.tsx', code);
