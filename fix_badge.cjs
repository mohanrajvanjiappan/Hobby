const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /\{stage === 'reveal' && question\.insight && \(/;
const newCode = `{stage === 'reveal' && quiz.mode === 'interactive' && quiz.isMultiplayer && (() => {
                  let isInteractiveCorrect = false;
                  if (quiz.type === 'detective') {
                    isInteractiveCorrect = interactiveOptionClicked === question.sentences?.[question.fakeSentenceIndex];
                  } else {
                    isInteractiveCorrect = interactiveOptionClicked === question.correctAnswer;
                  }
                  
                  if (!isInteractiveCorrect) return null;
                  
                  return (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none flex flex-col items-center"
                    >
                      <div className="bg-gradient-to-br from-amber-300 to-orange-500 p-8 rounded-full shadow-[0_0_100px_rgba(245,158,11,0.8)] border-8 border-white flex flex-col items-center gap-4 animate-bounce">
                        <span className="text-6xl text-white drop-shadow-lg">🌟</span>
                        <span className="bg-white text-orange-600 px-6 py-2 rounded-full font-black text-2xl uppercase tracking-widest shadow-inner whitespace-nowrap">
                          {quiz.topic} Master!
                        </span>
                        <span className="text-white font-bold text-2xl drop-shadow-md bg-black/20 px-4 py-1 rounded-full">
                          +1 {playersState[currentPlayerIndex]?.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })()}
                
                {stage === 'reveal' && question.insight && (`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/components/Presentation.tsx', content);
