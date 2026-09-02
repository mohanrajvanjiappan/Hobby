const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /<div className="flex flex-wrap items-center justify-center gap-8 w-full max-w-5xl">([\s\S]*?)<\/div>\s*<div className="mt-16 flex flex-wrap justify-center gap-6">/;

const newBadges = `
             <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 w-full max-w-7xl relative z-10 px-4">
               {earnedBadges.map((badge, idx) => {
                  return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ delay: idx * 0.2, type: 'spring', bounce: 0.5, duration: 1 }}
                    className="relative group bg-white/95 backdrop-blur-xl rounded-[3rem] p-8 md:p-10 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-[6px] border-white/50 w-72 md:w-80 overflow-hidden"
                  >
                    {/* Animated Shine Effect */}
                    <motion.div 
                      className="absolute inset-0 -translate-x-[150%] skew-x-[-30deg] bg-gradient-to-r from-transparent via-white/70 to-transparent z-0 group-hover:translate-x-[150%]"
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    
                    <motion.div 
                      animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
                      transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                      className="text-8xl md:text-9xl mb-8 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.2)] z-10 relative"
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-amber-400/20 blur-3xl rounded-full mix-blend-multiply" />
                      <span className="relative block transform transition-transform group-hover:scale-110 duration-500">{badge.icon}</span>
                    </motion.div>

                    <div className="z-10 bg-slate-900 text-amber-300 font-bold uppercase tracking-[0.15em] text-xs px-5 py-2 rounded-full mb-5 shadow-md border border-slate-700/50">
                      {badge.player}
                    </div>

                    <h3 className="z-10 text-3xl font-black text-slate-800 mb-4 tracking-tight leading-tight">{badge.name}</h3>
                    
                    <p className="z-10 text-sm md:text-base text-slate-500 font-semibold px-2 leading-relaxed">{badge.description}</p>
                  </motion.div>
               )})}
             </div>
             
             <div className="mt-16 flex flex-wrap justify-center gap-6">`;

code = code.replace(regex, newBadges);
fs.writeFileSync('src/components/Presentation.tsx', code);
