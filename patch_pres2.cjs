const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const type5clues = `      if (quiz.type === '5-clues') {`;
const typePresentation = `      if (quiz.type === 'text-presentation') {
        setClueIndex(-1);
        audioSynth.speak(question.insight || question.question);
        setTimeLeft(question.timeLimit || 15);
        
        // Show clues progressively based on time
        if (question.clues && question.clues.length > 0) {
          const intervalTime = Math.floor((question.timeLimit || 15) / (question.clues.length + 1));
          
          timerRef.current = setInterval(() => {
            if (isPausedRef.current) return;
            setTimeLeft((prev) => {
              if (prev <= 1) {
                if (timerRef.current) clearInterval(timerRef.current);
                if (currentQuestionIndex < quiz.questions.length - 1) {
                  setCurrentQuestionIndex((p) => p + 1);
                  setStage('question');
                } else {
                  if (quiz.mode === 'interactive') setStage('score');
                  else setStage('outro');
                }
                return 0;
              }
              const elapsed = (question.timeLimit || 15) - prev;
              const currentClue = Math.floor(elapsed / intervalTime) - 1;
              if (currentClue >= 0 && currentClue !== clueIndexRef) {
                setClueIndex(currentClue);
                clueIndexRef = currentClue;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          timerRef.current = setInterval(() => {
            if (isPausedRef.current) return;
            setTimeLeft((prev) => {
              if (prev <= 1) {
                if (timerRef.current) clearInterval(timerRef.current);
                if (currentQuestionIndex < quiz.questions.length - 1) {
                  setCurrentQuestionIndex((p) => p + 1);
                  setStage('question');
                } else {
                  if (quiz.mode === 'interactive') setStage('score');
                  else setStage('outro');
                }
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else if (quiz.type === '5-clues') {`;

content = content.replace(type5clues, typePresentation);

const oldHook = `  const mouseTimerRef = useRef<NodeJS.Timeout | null>(null);`;
const newHook = `  const mouseTimerRef = useRef<NodeJS.Timeout | null>(null);
  let clueIndexRef = clueIndex;`;
content = content.replace(oldHook, newHook);

// Also update UI for text-presentation
const uiOptionStart = `            {quiz.type !== '5-clues' && quiz.type !== 'detective' && quiz.type !== 'jumbled-letters' && quiz.type !== 'match-the-following' && quiz.type !== 'word-search' && (`;
const uiOptionNew = `            {quiz.type === 'text-presentation' && (
              <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-8">
                {question.clues?.map((clue, idx) => (
                  <AnimatePresence key={idx}>
                    {idx <= clueIndex && (
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-left shadow-lg border border-white/20"
                      >
                        <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                          • {clue}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            )}

            {quiz.type !== 'text-presentation' && quiz.type !== '5-clues' && quiz.type !== 'detective' && quiz.type !== 'jumbled-letters' && quiz.type !== 'match-the-following' && quiz.type !== 'word-search' && (`;

content = content.replace(uiOptionStart, uiOptionNew);

fs.writeFileSync('src/components/Presentation.tsx', content);
