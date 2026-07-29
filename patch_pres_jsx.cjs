const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const multiplayerIntroJSX = `
        {stage === 'multiplayer-intro' && (
          <motion.div
            key="multiplayer-intro"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center p-8 max-w-7xl flex flex-col items-center justify-center h-full z-10 w-full mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tight drop-shadow-2xl text-white">
              The Challengers
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
              {playersState.map((player, idx) => (
                <React.Fragment key={player.id || idx}>
                  {idx > 0 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 * idx, type: "spring" }}
                      className="text-6xl md:text-8xl font-black text-yellow-300 italic drop-shadow-[0_0_30px_rgba(253,224,71,0.8)]"
                    >
                      VS
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 * idx }}
                    className="flex flex-col items-center bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl w-full max-w-sm"
                  >
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-white mb-6" />
                    ) : (
                      <div className="w-32 h-32 md:w-48 md:h-48 bg-indigo-500 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-white mb-6 flex items-center justify-center text-6xl font-black text-white">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">{player.name}</h3>
                    {player.topic && <p className="text-xl text-indigo-200 font-semibold mb-2">Topic: {player.topic}</p>}
                    {player.details && <p className="text-lg text-white/80 italic text-center leading-tight">"{player.details}"</p>}
                  </motion.div>
                </React.Fragment>
              ))}
            </div>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              onClick={() => {
                audioSynth.playSwoosh();
                setStage('question-selection');
              }}
              className="mt-16 px-12 py-6 rounded-full bg-yellow-400 text-yellow-900 font-black text-3xl shadow-[0_0_50px_rgba(250,204,21,0.6)] hover:scale-105 transition-transform flex items-center gap-4"
            >
              <Play className="w-10 h-10 fill-current" />
              Let the Battle Begin!
            </motion.button>
          </motion.div>
        )}

        {stage === 'question-selection' && (
          <motion.div
            key="question-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-8 flex flex-col items-center justify-start h-full z-10 w-full mx-auto"
          >
            {/* Scoreboard */}
            <div className="flex justify-center gap-8 md:gap-16 w-full mb-12">
              {playersState.map((player, idx) => (
                <div key={player.id || idx} className={\`flex flex-col items-center p-4 rounded-2xl transition-all duration-500 \${idx === currentPlayerIndex ? 'bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-110 border-2 border-white' : 'opacity-70'}\`}>
                  <h4 className="text-2xl font-bold text-white mb-2">{player.name}</h4>
                  <div className="text-5xl font-black text-yellow-300 drop-shadow-md">{player.score}</div>
                  {idx === currentPlayerIndex && (
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ repeat: Infinity }}
                      className="mt-4 text-white font-bold"
                    >
                      👇 Your Turn!
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white drop-shadow-xl">
              {playersState[currentPlayerIndex]?.name}, select a question!
            </h2>

            {/* Grid of numbers */}
            <div className="grid grid-cols-4 md:grid-cols-5 gap-6 max-w-4xl w-full mx-auto">
              {quiz.questions.map((q, idx) => {
                const isAnswered = answeredQuestions.has(idx);
                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => {
                      audioSynth.playSwoosh();
                      setSelectedQuestionIndex(idx);
                      setCurrentQuestionIndex(idx);
                      setStage('countdown');
                    }}
                    className={\`aspect-square rounded-3xl flex items-center justify-center text-4xl md:text-6xl font-black transition-all \${
                      isAnswered 
                        ? 'bg-white/10 text-white/20 cursor-not-allowed border-2 border-white/5' 
                        : 'bg-white text-indigo-600 shadow-[0_10px_0_rgba(0,0,0,0.2)] hover:scale-105 active:translate-y-2 active:shadow-none'
                    }\`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                audioSynth.playSwoosh();
                setStage('score');
              }}
              className="mt-auto mb-8 px-8 py-4 bg-rose-500 text-white font-bold text-xl rounded-full shadow-lg hover:bg-rose-600 transition-colors"
            >
              End Quiz Early
            </button>
          </motion.div>
        )}
`;

const insertPoint = `{stage === 'countdown' && (`;

content = content.replace(insertPoint, multiplayerIntroJSX + "\n" + insertPoint);

fs.writeFileSync('src/components/Presentation.tsx', content);
