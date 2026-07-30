const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const search = `                {stage === 'reveal' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-2 px-6 py-4 rounded-3xl bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)] text-3xl md:text-4xl font-black text-center uppercase tracking-widest"
                  >
                    Answer: {question.correctAnswer}
                  </motion.div>
                )}`;

const replace = `                {stage === 'reveal' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={\`mt-2 px-6 py-4 rounded-3xl text-white border-b-8 shadow-[0_0_50px_rgba(16,185,129,0.8)] text-3xl md:text-4xl font-black text-center uppercase tracking-widest \${
                      quiz.mode === 'interactive' && interactiveOptionClicked && interactiveOptionClicked.toLowerCase() !== question.correctAnswer.toLowerCase()
                        ? 'bg-rose-500 border-rose-700 shadow-[0_0_50px_rgba(244,63,94,0.8)]'
                        : 'bg-emerald-500 border-emerald-700'
                    }\`}
                  >
                    {quiz.mode === 'interactive' && interactiveOptionClicked && interactiveOptionClicked.toLowerCase() !== question.correctAnswer.toLowerCase() ? (
                      <>
                        <span className="line-through opacity-70 text-2xl mr-4">{interactiveOptionClicked}</span>
                        <span>Correct: {question.correctAnswer}</span>
                      </>
                    ) : (
                      \`Answer: \${question.correctAnswer}\`
                    )}
                  </motion.div>
                )}`;

content = content.replace(search, replace);

fs.writeFileSync('src/components/Presentation.tsx', content);
