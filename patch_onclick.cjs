const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

// For standard multiple choice options
content = content.replace(
  `                      <motion.div
                        key={i}
                        onClick={() => {
                          if (quiz.mode === 'interactive' && !isReveal) {`,
  `                      <motion.div
                        key={i}
                        onClick={() => {
                          if (isEliminated) return;
                          if (quiz.mode === 'interactive' && !isReveal) {`
);

// For 5-clues options
content = content.replace(
  `                      <div key={i} 
                        onClick={() => {
                          if (quiz.mode === 'interactive' && !isReveal) {`,
  `                      <div key={i} 
                        onClick={() => {
                          if (isEliminated) return;
                          if (quiz.mode === 'interactive' && !isReveal) {`
);

fs.writeFileSync('src/components/Presentation.tsx', content);
