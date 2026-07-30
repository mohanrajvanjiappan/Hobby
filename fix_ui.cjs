const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const wrongInsert = `                {quiz.mode === 'interactive' && stage !== 'reveal' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex flex-col md:flex-row gap-4 items-stretch justify-center w-full max-w-3xl mx-auto"
                  >
                    <input
                      type="text"
                      value={jumbledInput}
                      onChange={(e) => setJumbledInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleJumbledSubmit();
                        }
                      }}
                      className="flex-1 px-8 py-5 rounded-full text-3xl md:text-4xl font-bold text-center text-slate-800 border-4 border-indigo-200 focus:border-indigo-500 focus:outline-none shadow-inner"
                      placeholder="Type answer here..."
                      autoFocus
                    />
                    <button
                      onClick={handleJumbledSubmit}
                      className="px-10 py-5 rounded-full bg-emerald-500 text-white font-black text-3xl md:text-4xl shadow-[0_10px_0_rgba(16,185,129,1)] hover:translate-y-2 hover:shadow-none transition-all"
                    >
                      SUBMIT
                    </button>
                  </motion.div>
                )}
`;

content = content.replace(wrongInsert, '');

const correctSearch = `                {stage === 'reveal' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-2 px-6 py-4 rounded-3xl bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)] text-3xl md:text-4xl font-black text-center uppercase tracking-widest"
                  >
                    Answer: {question.correctAnswer}
                  </motion.div>
                )}`;

const correctInsert = wrongInsert + correctSearch;
content = content.replace(correctSearch, correctInsert);

fs.writeFileSync('src/components/Presentation.tsx', content);
