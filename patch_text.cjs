const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const target = `<h2 style={{ fontFamily: "var(--font-display)" }} className={\`font-black tracking-tight text-slate-900 \${quiz.mode === 'interactive' ? 'text-left' : 'text-center'} leading-tight drop-shadow-sm flex-1 \${currentType === '5-clues' || currentType === 'detective' || currentType === 'find-in-map' || isJumbledLetters || currentType === 'match-the-following' || currentType === 'word-search' ? 'text-3xl md:text-4xl lg:text-[3rem] p-2' : 'text-4xl md:text-5xl lg:text-[4rem] p-2'}\`}>`;

const replacement = `<motion.h2 
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                    style={{ fontFamily: "var(--font-display)" }} 
                    className={\`font-black tracking-tight text-slate-900 \${quiz.mode === 'interactive' ? 'text-left' : 'text-center'} leading-tight drop-shadow-sm flex-1 \${currentType === '5-clues' || currentType === 'detective' || currentType === 'find-in-map' || isJumbledLetters || currentType === 'match-the-following' || currentType === 'word-search' ? 'text-3xl md:text-4xl lg:text-[3rem] p-2' : 'text-4xl md:text-5xl lg:text-[4.5rem] p-4'}\`}>`;

code = code.replace(target, replacement);

const target2 = `{question.question || 'Unjumble the word!'}
                  </h2>`;
const replacement2 = `{question.question || 'Unjumble the word!'}
                  </motion.h2>`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/Presentation.tsx', code);
