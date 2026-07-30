const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const target = `
                  <h2 className={\`font-extrabold text-slate-800 \${quiz.mode === 'interactive' ? 'text-left' : 'text-center'} leading-tight drop-shadow-sm flex-1 \${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' || quiz.type === 'jumbled-letters' || quiz.type === 'match-the-following' || quiz.type === 'word-search' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-5xl md:text-6xl lg:text-7xl'}\`}>
                    {quiz.type === 'jumbled-letters' ? 'Unjumble the word!' : question.question}
                  </h2>
`;
const replacement = `
                  <h2 className={\`font-extrabold text-slate-800 \${quiz.mode === 'interactive' ? 'text-left' : 'text-center'} leading-tight drop-shadow-sm flex-1 \${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' || quiz.type === 'jumbled-letters' || quiz.type === 'match-the-following' || quiz.type === 'word-search' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-5xl md:text-6xl lg:text-7xl'}\`}>
                    {question.question || 'Unjumble the word!'}
                  </h2>
`;
code = code.replace(target.trim(), replacement.trim());
fs.writeFileSync('src/components/Presentation.tsx', code);
