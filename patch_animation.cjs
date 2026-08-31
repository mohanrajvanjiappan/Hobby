const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldAnim = `            initial={{ opacity: 0, x: 100, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}`;

const newAnim = `            initial={{ opacity: 0, x: currentQuestionIndex % 2 === 0 ? '100vw' : '-100vw', scale: 0.8, rotateY: currentQuestionIndex % 2 === 0 ? 45 : -45 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, x: currentQuestionIndex % 2 === 0 ? '-100vw' : '100vw', scale: 1.2, rotateY: currentQuestionIndex % 2 === 0 ? -45 : 45 }}
            transition={{ type: "spring", stiffness: 90, damping: 20, mass: 1 }}`;

code = code.replace(oldAnim, newAnim);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done");
