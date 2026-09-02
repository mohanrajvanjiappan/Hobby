const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /<motion\.div\s+initial=\{\{ scale: 0, opacity: 0, y: 50 \}\}\s+animate=\{\{ scale: 1, opacity: 1, y: 0 \}\}\s+transition=\{\{ type: 'spring', bounce: 0\.5 \}\}\s+className=\{\`bg-white rounded-3xl p-12 flex flex-col items-center text-center shadow-\[0_40px_100px_rgba\(0,0,0,0\.5\)\] border-b-\[16px\] \$\{currentBadge\.color\} w-full max-w-md\`\}\s*>([\s\S]*?)<\/motion\.div>/;

const newVideoBadge = `
             <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: -15 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
                className={\`relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-[3rem] p-12 flex flex-col items-center text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-4 \${currentBadge.color} w-full max-w-lg\`}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                />
                <motion.div 
                  animate={{ y: [0, -15, 0], rotate: [-3, 3, -3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-8xl md:text-[10rem] mb-10 filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)] relative z-10"
                >
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-400/20 blur-3xl rounded-full mix-blend-multiply" />
                   <span className="relative block">{currentBadge.icon}</span>
                </motion.div>
                <h3 className={\`text-4xl md:text-5xl font-black \${currentBadge.text} mb-4 relative z-10 tracking-tight leading-tight\`}>{currentBadge.title}</h3>
                <p className="text-xl md:text-2xl text-slate-500 font-bold relative z-10 leading-snug">{currentBadge.description}</p>
                <div className="mt-8 py-3 px-8 bg-slate-900 rounded-full font-bold text-amber-300 tracking-wider text-sm uppercase shadow-lg border border-slate-700 relative z-10">
                  {numAnswered} Questions Completed in {currentBadge.contextTopic}!
                </div>
              </motion.div>`;

code = code.replace(regex, newVideoBadge.trim());
fs.writeFileSync('src/components/Presentation.tsx', code);
