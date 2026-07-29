const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const badgesJSX = `
        {stage === 'badges' && (
          <motion.div
            key="badges"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
             <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-12">
               Earned Badges!
             </h1>
             <div className="flex flex-wrap items-center justify-center gap-8 w-full max-w-5xl">
               {earnedBadges.map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.4, type: 'spring', bounce: 0.5 }}
                    className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-b-[12px] border-slate-200 w-64 md:w-80"
                  >
                    <div className="text-7xl md:text-8xl mb-6 filter drop-shadow-md">{badge.icon}</div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">{badge.name}</h3>
                    <p className="text-lg text-slate-500 font-bold mb-4">{badge.player}</p>
                    <p className="text-sm md:text-base text-slate-600 font-medium">{badge.description}</p>
                  </motion.div>
               ))}
             </div>
             
             <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: earnedBadges.length * 0.4 + 1 }}
                  onClick={() => {
                    if (quiz.participantTopic && quiz.participantTopic.trim()) {
                      setStage('talk');
                    } else {
                      setStage('outro');
                    }
                  }}
                  className="mt-16 mx-auto px-10 py-5 bg-yellow-400 text-yellow-900 rounded-full font-black text-2xl shadow-[0_10px_0_rgba(202,138,4,1)] hover:translate-y-2 hover:shadow-none transition-all"
                >
                  Continue
             </motion.button>
          </motion.div>
        )}
`;

content = content.replace("{stage === 'talk'", badgesJSX + "\n        {stage === 'talk'");
fs.writeFileSync('src/components/Presentation.tsx', content);
