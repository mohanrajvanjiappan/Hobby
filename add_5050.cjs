const fs = require('fs');
const content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');
const searchPoint = `  const isInteractiveTimeout = quiz.mode === 'interactive' && stage === 'reveal' && interactiveOptionClicked === null;`;

const logic = `
  const handleFiftyFifty = () => {
    if (!question || !question.options) return;
    
    const categoryKey = question.category || 'default';
    const fiftyKey = \`\${currentPlayerIndex}-\${categoryKey}\`;
    
    if (usedFiftyFifty[fiftyKey]) return;
    
    const incorrectIndices: number[] = [];
    question.options.forEach((opt, idx) => {
      if (opt !== question.correctAnswer) {
        incorrectIndices.push(idx);
      }
    });
    
    // Shuffle and pick half
    incorrectIndices.sort(() => Math.random() - 0.5);
    const toEliminate = incorrectIndices.slice(0, Math.floor(incorrectIndices.length / 2));
    
    setEliminatedOptions(toEliminate);
    setUsedFiftyFifty(prev => ({ ...prev, [fiftyKey]: true }));
    audioSynth.playSwoosh();
  };
`;

fs.writeFileSync('src/components/Presentation.tsx', content.replace(searchPoint, logic + '\\n' + searchPoint));
