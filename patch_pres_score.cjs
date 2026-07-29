const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldScoreJSX = `
        {stage === 'score' && quiz.mode === 'interactive' && (
          <motion.div
            key="score"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10 mx-auto"
          >
            <div className="relative flex justify-center items-center">
              <Trophy className="w-40 h-40 text-yellow-300 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)]" />
              <Star className="w-12 h-12 text-yellow-100 absolute -top-4 -right-8 animate-spin-slow" />
              <Sparkles className="w-10 h-10 text-yellow-100 absolute top-4 -left-8 animate-ping" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl">
              {quiz.teamName || 'Player 1'}
            </h1>
            <div className="flex items-center justify-center gap-8 mt-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [-15, 15, -15],
                  x: [0, 20, 0]
                }}
                transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
                className="text-[6rem] md:text-[10rem] drop-shadow-xl origin-right"
              >
                👏
              </motion.div>
              <p className="text-[10rem] md:text-[16rem] font-bold text-cyan-100 drop-shadow-lg leading-none">
                {score} <span className="text-[5rem] md:text-[8rem] text-cyan-200">/ {quiz.questions.length}</span>
              </p>
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [15, -15, 15],
                  x: [0, -20, 0]
                }}
                transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
                className="text-[6rem] md:text-[10rem] drop-shadow-xl origin-left"
                style={{ transform: "scaleX(-1)" }}
              >
                👏
              </motion.div>
            </div>
          </motion.div>
        )}
`;

const newScoreJSX = `
        {stage === 'score' && quiz.mode === 'interactive' && (
          <motion.div
            key="score"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
            <div className="relative flex justify-center items-center mb-8">
              <Trophy className="w-32 h-32 md:w-40 md:h-40 text-yellow-300 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)]" />
              <Star className="w-12 h-12 text-yellow-100 absolute -top-4 -right-8 animate-spin-slow" />
              <Sparkles className="w-10 h-10 text-yellow-100 absolute top-4 -left-8 animate-ping" />
            </div>

            {quiz.isMultiplayer ? (
              <div className="flex flex-col gap-6 w-full max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-8">
                  Final Scores!
                </h1>
                {[...playersState].sort((a, b) => b.score - a.score).map((player, idx) => (
                  <motion.div 
                    key={player.id}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.5, type: 'spring' }}
                    className={\`flex items-center justify-between p-6 rounded-3xl \${idx === 0 ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_40px_rgba(250,204,21,0.6)] scale-105 border-4 border-white' : 'bg-white/20 text-white backdrop-blur-sm border-2 border-white/30'}\`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={\`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black \${idx === 0 ? 'bg-white text-yellow-500' : 'bg-white/30 text-white'}\`}>
                        {idx + 1}
                      </div>
                      {player.photo && <img src={player.photo} className="w-16 h-16 rounded-full border-2 border-white object-cover" />}
                      <h2 className="text-3xl md:text-5xl font-bold">{player.name}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      {idx === 0 && <span className="text-5xl">👑</span>}
                      <span className="text-5xl md:text-6xl font-black">{player.score}</span>
                    </div>
                  </motion.div>
                ))}
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: playersState.length * 0.5 + 1 }}
                  onClick={() => setStage('outro')}
                  className="mt-8 mx-auto px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-xl md:text-2xl shadow-xl hover:bg-indigo-50 transition-all"
                >
                  Finish
                </motion.button>
              </div>
            ) : (
              <>
                <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl">
                  {quiz.teamName || 'Player 1'}
                </h1>
                <div className="flex items-center justify-center gap-8 mt-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [-15, 15, -15],
                      x: [0, 20, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
                    className="text-[6rem] md:text-[10rem] drop-shadow-xl origin-right"
                  >
                    👏
                  </motion.div>
                  <p className="text-[10rem] md:text-[16rem] font-bold text-cyan-100 drop-shadow-lg leading-none">
                    {score} <span className="text-[5rem] md:text-[8rem] text-cyan-200">/ {quiz.questions.length}</span>
                  </p>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [15, -15, 15],
                      x: [0, -20, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
                    className="text-[6rem] md:text-[10rem] drop-shadow-xl origin-left"
                    style={{ transform: "scaleX(-1)" }}
                  >
                    👏
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}
`;

content = content.replace(oldScoreJSX, newScoreJSX);

fs.writeFileSync('src/components/Presentation.tsx', content);
