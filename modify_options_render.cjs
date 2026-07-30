const fs = require('fs');
const content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

let newContent = content;

// Regular questions
const search1 = `                  {question.options?.map((option, i) => {
                    const isCorrect = option === question.correctAnswer;
                    const isReveal = stage === 'reveal';
                    
                    let cardClass = "bg-white text-slate-800 border-b-8 border-slate-300";
                    if (quiz.mode === 'interactive' && !isReveal) {`;
const replace1 = `                  {question.options?.map((option, i) => {
                    const isCorrect = option === question.correctAnswer;
                    const isReveal = stage === 'reveal';
                    const isEliminated = eliminatedOptions.includes(i);
                    
                    let cardClass = "bg-white text-slate-800 border-b-8 border-slate-300";
                    if (isEliminated && !isReveal) {
                      cardClass = "bg-slate-100 text-slate-400 border-b-8 border-slate-200 opacity-40 pointer-events-none";
                    } else if (quiz.mode === 'interactive' && !isReveal) {`;

newContent = newContent.replace(search1, replace1);

// 5-clues options
const search2 = `                  {question.options.map((option, i) => {
                    const isCorrect = option === question.correctAnswer;
                    const isReveal = stage === 'reveal';
                    let optClass = "bg-slate-100 text-slate-700 border-2 border-slate-200";
                    if (quiz.mode === 'interactive' && !isReveal) {`;
const replace2 = `                  {question.options.map((option, i) => {
                    const isCorrect = option === question.correctAnswer;
                    const isReveal = stage === 'reveal';
                    const isEliminated = eliminatedOptions.includes(i);
                    let optClass = "bg-slate-100 text-slate-700 border-2 border-slate-200";
                    if (isEliminated && !isReveal) {
                      optClass = "bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-40 pointer-events-none";
                    } else if (quiz.mode === 'interactive' && !isReveal) {`;

newContent = newContent.replace(search2, replace2);

fs.writeFileSync('src/components/Presentation.tsx', newContent);
