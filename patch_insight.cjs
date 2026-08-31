const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const targetInsight = `{stage === 'insight' && question.insight && (
          <motion.div
            key={\`insight-\${currentQuestionIndex}\`}
            className="relative flex flex-col items-center justify-center p-8 md:p-12 text-center z-10 w-full h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <div className="bg-emerald-900/40 backdrop-blur-md rounded-[3rem] p-10 md:p-16 shadow-[0_0_50px_rgba(52,211,153,0.3)] border-4 border-emerald-400 w-[80vw] h-[80vh] max-w-none flex flex-col items-center justify-center">
              <Lightbulb className="w-20 h-20 md:w-24 md:h-24 text-yellow-300 mx-auto mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]" />
              <h2 className="text-3xl md:text-5xl font-black text-yellow-300 leading-tight mb-6 uppercase tracking-widest drop-shadow-md">Did you know?</h2>
              {question.insightImageUrl && quiz.enableInsightImages !== false && (
                <img src={question.insightImageUrl} alt="Insight" className="w-auto max-w-full h-auto max-h-[45vh] object-contain rounded-3xl shadow-xl mb-8 border-4 border-emerald-300/50" />
              )}
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-snug drop-shadow-lg">
                {question.insight}
              </p>
            </div>
          </motion.div>
        )}`;

const replaceInsight = `{stage === 'insight' && question.insight && (
          <motion.div
            key={\`insight-\${currentQuestionIndex}\`}
            className="relative flex flex-col items-center justify-center p-4 md:p-8 text-center z-10 w-full h-full overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          >
            {/* Background animated stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-300 opacity-60 text-5xl md:text-7xl"
                  initial={{ y: "120vh", x: (Math.random() - 0.5) * 1200 }}
                  animate={{ y: "-20vh", rotate: 360 }}
                  transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
                >
                  ✨
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 rounded-[3rem] p-6 md:p-12 shadow-[0_30px_70px_rgba(168,85,247,0.5)] border-[8px] md:border-[12px] border-white/90 w-[95vw] md:w-[85vw] h-auto min-h-[60vh] max-h-[85vh] flex flex-col items-center justify-center relative z-10">
              
              <motion.div 
                animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="absolute -top-10 md:-top-16 bg-yellow-400 border-[6px] border-white rounded-full p-4 md:p-6 shadow-2xl z-20"
              >
                <Lightbulb className="w-10 h-10 md:w-16 md:h-16 text-white" fill="currentColor" />
              </motion.div>

              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mt-8 mb-6 uppercase tracking-wider drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
                <span className="text-yellow-300">Did you</span> know?
              </h2>

              {question.insightImageUrl && quiz.enableInsightImages !== false && (
                <motion.div
                  initial={{ rotate: -5, scale: 0.5 }}
                  animate={{ rotate: 3, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.6 }}
                  className="bg-white p-3 md:p-4 pb-8 md:pb-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] mb-8 max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto z-10"
                >
                  <img src={question.insightImageUrl} alt="Insight" className="w-auto h-auto max-h-[35vh] object-contain rounded-xl" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                </motion.div>
              )}
              
              <div className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-3xl p-6 md:p-8 shadow-inner max-w-4xl mx-auto w-full">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug drop-shadow-md">
                  {question.insight}
                </p>
              </div>

            </div>
          </motion.div>
        )}`;

code = code.replace(targetInsight, replaceInsight);
fs.writeFileSync('src/components/Presentation.tsx', code);
