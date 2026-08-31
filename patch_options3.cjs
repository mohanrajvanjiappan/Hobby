const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const target = `                    return (
                      <motion.div
                        key={i}`;

const replacement = `                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={isReveal && isCorrect ? { scale: [1, 1.05, 1], opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
                        transition={isReveal && isCorrect ? { repeat: Infinity, duration: 1.5 } : { delay: i * 0.1, type: "spring", stiffness: 100 }}
                        key={i}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/Presentation.tsx', code);
