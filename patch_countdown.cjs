const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Add countdownNumber state
content = content.replace(
  "const [warmupFeeling, setWarmupFeeling] = useState<string | null>(null);",
  "const [warmupFeeling, setWarmupFeeling] = useState<string | null>(null);\n  const [countdownNumber, setCountdownNumber] = useState(5);"
);

// Add countdown logic in useEffect
const oldEffectEnd = `      return () => {
        timeouts.forEach(clearTimeout);
        window.speechSynthesis.cancel();
      };
    }
    
    if (stage === 'question') {`;

const newEffectEnd = `      return () => {
        timeouts.forEach(clearTimeout);
        window.speechSynthesis.cancel();
      };
    }

    if (stage === 'countdown') {
      let current = 5;
      setCountdownNumber(current);
      audioSynth.playTick();
      const interval = setInterval(() => {
        if (isPausedRef.current) return;
        current--;
        if (current > 0) {
          setCountdownNumber(current);
          audioSynth.playTick();
        } else {
          clearInterval(interval);
          audioSynth.playSwoosh();
          setStage('question');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    
    if (stage === 'question') {`;

content = content.replace(oldEffectEnd, newEffectEnd);

// Update Let's Get Started button
content = content.replace(
  "audioSynth.playSwoosh();\n                    setStage('question');",
  "audioSynth.playSwoosh();\n                    setStage('countdown');"
);

// Add countdown UI
const newCountdownUI = `        )}

        {stage === 'countdown' && (
          <motion.div
            key="countdown"
            className="text-center p-12 flex flex-col items-center justify-center h-full z-10 w-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={countdownNumber}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[15rem] font-black text-white drop-shadow-2xl"
              >
                {countdownNumber}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {(stage === 'question' || stage === 'reveal') && (`;

content = content.replace("        )}\n\n        {(stage === 'question' || stage === 'reveal') && (", newCountdownUI);

fs.writeFileSync('src/components/Presentation.tsx', content);
