const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const newUI = `{stage === 'video-badges' && (
          <motion.div
            key="video-badges"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
             <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-12">
               Audience Milestone!
             </h1>
             <motion.div
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="bg-white rounded-3xl p-12 flex flex-col items-center text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-b-[16px] border-amber-400 w-full max-w-md"
              >
                <div className="text-8xl md:text-9xl mb-8 filter drop-shadow-lg animate-bounce">🌟</div>
                <h3 className="text-3xl md:text-5xl font-black text-amber-600 mb-4">{currentQuestionIndex + 1} Questions!</h3>
                <p className="text-xl md:text-2xl text-slate-600 font-bold">Great job following along!</p>
              </motion.div>
          </motion.div>
        )}

        {stage === 'badges' && (`;

content = content.replace("{stage === 'badges' && (", newUI);
fs.writeFileSync('src/components/Presentation.tsx', content);
