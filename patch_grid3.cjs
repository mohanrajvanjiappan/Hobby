const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const target1 = `           if (quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode') {
             setStage('question-selection');
           } else {
             setCurrentQuestionIndex((prev) => prev + 1);
             setStage('question');
           }`;

const replace1 = `           if (quiz.mode === 'interactive' && quiz.type !== 'combat-mode') {
             if (categories.length > 1) {
               const categoryQuestions = quiz.questions.map((q, i) => ({q, i})).filter(x => x.q.category === selectedCategory);
               if (categoryQuestions.length > 0 && categoryQuestions.every(x => answeredQuestions.has(x.i))) {
                 setStage('category-selection');
               } else {
                 setStage('question-selection');
               }
             } else {
               setStage('question-selection');
             }
           } else {
             setCurrentQuestionIndex((prev) => prev + 1);
             setStage('question');
           }`;

content = content.replace(target1, replace1);

const target2 = `              if (isInteractiveGrid) {
                setStage('question-selection');
              }`;

const replace2 = `              if (isInteractiveGrid) {
                if (categories.length > 1) {
                  const categoryQuestions = quiz.questions.map((q, i) => ({q, i})).filter(x => x.q.category === selectedCategory);
                  if (categoryQuestions.length > 0 && categoryQuestions.every(x => answeredQuestions.has(x.i))) {
                    setStage('category-selection');
                  } else {
                    setStage('question-selection');
                  }
                } else {
                  setStage('question-selection');
                }
              }`;

content = content.replace(target2, replace2);

const target3 = `              onClick={() => {
                audioSynth.playSwoosh();
                setStage('question-selection');
              }}`;
const replace3 = `              onClick={() => {
                audioSynth.playSwoosh();
                if (categories.length > 1) {
                  setStage('category-selection');
                } else {
                  setStage('question-selection');
                }
              }}`;
content = content.replace(target3, replace3);

const target4 = `const categories = useMemo(() => Array.from(new Set(quiz.questions.map(q => q.category).filter(Boolean))) as string[], [quiz.questions]);`;

if (!content.includes(target4)) {
    // Inject selectedCategory state and categories memo
    const targetState = `  const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);`;
    const replaceState = `  const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = useMemo(() => Array.from(new Set(quiz.questions.map(q => q.category).filter(Boolean))) as string[], [quiz.questions]);`;
    content = content.replace(targetState, replaceState);
}


fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched grid 3!");
