const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const search = `  const isInteractiveTimeout = quiz.mode === 'interactive' && stage === 'reveal' && interactiveOptionClicked === null;`;

const replace = `  const getAwardPoints = () => {
    let inc = (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
    if (quiz.mode === 'interactive' && quiz.type === '5-clues') {
      inc = 10;
      if (clueIndex === 2) inc = 9;
      else if (clueIndex === 3) inc = 8;
      else if (clueIndex >= 4) inc = 7;
    }
    return inc;
  };

  const isInteractiveTimeout = quiz.mode === 'interactive' && stage === 'reveal' && interactiveOptionClicked === null;`;

content = content.replace(search, replace);
fs.writeFileSync('src/components/Presentation.tsx', content);
