const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldOutro = `        {stage === 'outro' && (
          <motion.div
            key="outro"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.6)] border-8 border-white mb-8"
            >
              <img src={quizLogo} alt="Quiz Time Brain Boosters" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" />
            </motion.div>

            <div className="relative mb-8 flex justify-center items-center">
              <Trophy className="w-32 h-32 text-yellow-300 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)]" />
              <Star className="w-12 h-12 text-yellow-100 absolute -top-4 -right-8 animate-spin-slow" />
              <Sparkles className="w-10 h-10 text-yellow-100 absolute top-4 -left-8 animate-ping" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-2xl">
              {outroMessage.title}
            </h1>
            <p className="text-3xl md:text-5xl font-bold opacity-100 text-cyan-100 drop-shadow-lg mb-4">
              {outroMessage.subtitle}
            </p>
            <p className="text-2xl md:text-3xl font-medium opacity-90 text-white">
              {outroMessage.footer}
            </p>
          </motion.div>
        )}`;

const newOutro = `        {stage === 'outro' && (
          <motion.div
            key="outro"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10"
          >
            {quiz.mode === 'interactive' ? (
              <>
                <div className="relative mb-8 flex justify-center items-center">
                  <Trophy className="w-40 h-40 text-yellow-300 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)]" />
                  <Star className="w-12 h-12 text-yellow-100 absolute -top-4 -right-8 animate-spin-slow" />
                  <Sparkles className="w-10 h-10 text-yellow-100 absolute top-4 -left-8 animate-ping" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 text-white drop-shadow-2xl">
                  {quiz.teamName || 'Player 1'}
                </h1>
                <p className="text-6xl md:text-8xl font-bold text-cyan-100 drop-shadow-lg mb-6">
                  {score} <span className="text-3xl md:text-5xl text-cyan-200">/ {quiz.questions.length}</span>
                </p>
                <p className="text-2xl md:text-3xl font-medium opacity-90 text-white">
                  Thanks for playing!
                </p>
                <button
                  onClick={onExit}
                  className="mt-12 px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-xl md:text-2xl shadow-xl hover:bg-indigo-50 transition-all active:scale-95"
                >
                  Play Again
                </button>
              </>
            ) : (
              <>
                <motion.div 
                  animate={{ y: [0, -20, 0] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.6)] border-8 border-white mb-8"
                >
                  <img src={quizLogo} alt="Quiz Time Brain Boosters" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" />
                </motion.div>

                <div className="relative mb-8 flex justify-center items-center">
                  <Trophy className="w-32 h-32 text-yellow-300 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)]" />
                  <Star className="w-12 h-12 text-yellow-100 absolute -top-4 -right-8 animate-spin-slow" />
                  <Sparkles className="w-10 h-10 text-yellow-100 absolute top-4 -left-8 animate-ping" />
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-2xl">
                  {outroMessage.title}
                </h1>
                <p className="text-3xl md:text-5xl font-bold opacity-100 text-cyan-100 drop-shadow-lg mb-4">
                  {outroMessage.subtitle}
                </p>
                <p className="text-2xl md:text-3xl font-medium opacity-90 text-white">
                  {outroMessage.footer}
                </p>
              </>
            )}
          </motion.div>
        )}`;

content = content.replace(oldOutro, newOutro);
fs.writeFileSync('src/components/Presentation.tsx', content);
