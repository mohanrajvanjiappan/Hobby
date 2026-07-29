const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldClues = `{quiz.type === 'text-presentation' && (
              <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-8">
                {question.clues?.map((clue, idx) => (
                  <AnimatePresence key={idx}>
                    {idx <= clueIndex && (
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-left shadow-lg border border-white/20"
                      >
                        <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                          • {clue}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            )}`;

const newClues = `{quiz.type === 'text-presentation' && (
              <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-4 mb-4">
                {question.clues?.map((clue, idx) => (
                  <AnimatePresence key={idx}>
                    {idx <= clueIndex && (
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-indigo-50 rounded-2xl p-6 text-left shadow-md border-l-8 border-indigo-500"
                      >
                        <p className="text-3xl md:text-4xl font-bold text-indigo-900 drop-shadow-sm">
                          {clue}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            )}`;

content = content.replace(oldClues, newClues);
fs.writeFileSync('src/components/Presentation.tsx', content);
