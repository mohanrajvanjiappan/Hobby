const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const targetBadges = `{stage === 'badges' && (
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
                    className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-t-[4px] border-white/80 border-b-[12px] border-slate-200 w-64 md:w-80"
                  >
                    <div className="text-7xl md:text-8xl mb-6 filter drop-shadow-md">{badge.icon}</div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">{badge.name}</h3>
                    <p className="text-lg text-slate-500 font-bold mb-4">{badge.player}</p>
                    <p className="text-sm md:text-base text-slate-600 font-medium">{badge.description}</p>
                  </motion.div>
               ))}
             </div>`;

const replaceBadges = `{stage === 'badges' && (
          <motion.div
            key="badges"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative flex flex-col items-center justify-center p-8 md:p-12 text-center z-10 w-full h-full overflow-hidden"
          >
            {/* Background animated stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-300 opacity-60 text-4xl md:text-6xl"
                  initial={{ y: "120vh", x: (Math.random() - 0.5) * 1400 }}
                  animate={{ y: "-20vh", rotate: 360 }}
                  transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
                >
                  ⭐
                </motion.div>
              ))}
            </div>

            <motion.h1 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)] mb-12 uppercase tracking-wider relative z-10"
            >
              <span className="text-yellow-300">Earned</span> Badges!
            </motion.h1>

             <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 w-full max-w-6xl relative z-10">
               {earnedBadges.map((badge, idx) => {
                  const rotate = (idx % 2 === 0 ? 1 : -1) * (Math.random() * 4 + 2);
                  return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, opacity: 0, y: 100 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05, rotate: 0 }}
                    transition={{ delay: idx * 0.4, type: 'spring', bounce: 0.6, duration: 0.8 }}
                    className="relative group bg-gradient-to-br from-white to-slate-100 rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-[6px] md:border-[8px] border-white w-64 md:w-80"
                    style={{ rotate: rotate }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-[2.8rem] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10" />
                    
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                      className="text-7xl md:text-9xl mb-4 md:mb-6 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] z-10"
                    >
                      {badge.icon}
                    </motion.div>

                    <div className="bg-indigo-100 text-indigo-700 font-bold uppercase tracking-widest text-xs px-4 py-1.5 rounded-full mb-3 border-2 border-indigo-200">
                      {badge.player}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-3 leading-tight tracking-tight">{badge.name}</h3>
                    
                    <p className="text-sm md:text-base text-slate-600 font-bold px-2 leading-snug">{badge.description}</p>
                  </motion.div>
               )})}
             </div>`;

code = code.replace(targetBadges, replaceBadges);
fs.writeFileSync('src/components/Presentation.tsx', code);
