const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Add warmup to Stage type
content = content.replace(
  "type Stage = 'intro' | 'question' | 'reveal' | 'quote' | 'outro';",
  "type Stage = 'intro' | 'warmup' | 'question' | 'reveal' | 'quote' | 'outro';"
);

// Add warmupFeeling state
content = content.replace(
  "const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);",
  "const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);\n  const [warmupFeeling, setWarmupFeeling] = useState<string | null>(null);"
);

// Update setStage to warmup in intro
content = content.replace(
  "              audioSynth.playSwoosh();\n              setStage('question');\n            }, 2000);",
  "              audioSynth.playSwoosh();\n              if (quiz.mode === 'interactive') {\n                setStage('warmup');\n              } else {\n                setStage('question');\n              }\n            }, 2000);"
);

// Add warmup UI
const newWarmupUI = `        )}

        {stage === 'warmup' && (
          <motion.div
            key="warmup"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center p-12 max-w-4xl flex flex-col items-center justify-center h-full z-10 w-full"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tight drop-shadow-2xl text-white">
              How are you feeling today?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 w-full max-w-3xl">
              {['Curious', 'Scared', 'Excited', 'Happy'].map((feeling) => (
                <button
                  key={feeling}
                  onClick={() => setWarmupFeeling(feeling)}
                  className={\`py-6 rounded-2xl text-2xl font-bold transition-all \${
                    warmupFeeling === feeling
                      ? 'bg-fuchsia-500 text-white shadow-[0_0_30px_rgba(217,70,239,0.5)] scale-110'
                      : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/20'
                  }\`}
                >
                  {feeling}
                </button>
              ))}
            </div>
            
            <AnimatePresence>
              {warmupFeeling && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    audioSynth.playSwoosh();
                    setStage('question');
                  }}
                  className="px-12 py-6 rounded-full bg-white text-indigo-900 font-black text-3xl shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform flex items-center gap-4"
                >
                  <Play className="w-10 h-10 fill-current" />
                  Let's Get Started!
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}`;

content = content.replace("        )}", newWarmupUI);

fs.writeFileSync('src/components/Presentation.tsx', content);
