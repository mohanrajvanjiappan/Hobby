const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldBtn = `<motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: playersState.length * 0.5 + 1 }}
                  onClick={() => setStage('outro')}
                  className="mt-8 mx-auto px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-xl md:text-2xl shadow-xl hover:bg-indigo-50 transition-all"
                >
                  Finish
                </motion.button>`;

const newBtn = `<motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: playersState.length * 0.5 + 1 }}
                  onClick={() => setStage('badges')}
                  className="mt-8 mx-auto px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-xl md:text-2xl shadow-xl hover:bg-indigo-50 transition-all"
                >
                  See Badges
                </motion.button>`;

content = content.replace(oldBtn, newBtn);
fs.writeFileSync('src/components/Presentation.tsx', content);
