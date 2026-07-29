const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const target1 = `        {(stage === 'question' || stage === 'reveal') && (
          <motion.div
            key={\`q-container-\${currentQuestionIndex}\`}
            className="relative"
            style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
          >`;
const replace1 = `        {(stage === 'question' || stage === 'reveal') && (
          <motion.div
            key={\`q-container-\${currentQuestionIndex}\`}
            className="relative"
            style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >`;

content = content.replace(target1, replace1);

const target2 = `          <motion.div
            key={\`q-container-inner-\${currentQuestionIndex}\`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className={\`\${quiz.mode === 'interactive' ? 'w-[75vw] ml-4 md:ml-8 mr-auto justify-center' : 'w-[90vw] mx-auto'} max-w-[1800px] h-full flex flex-col z-10 \${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'p-4 md:p-6' : 'p-8 md:p-12'}\`}
          >`;

const replace2 = `          <motion.div
            key={\`q-container-inner-\${currentQuestionIndex}\`}
            className={\`\${quiz.mode === 'interactive' ? 'w-[75vw] ml-4 md:ml-8 mr-auto justify-center' : 'w-[90vw] mx-auto'} max-w-[1800px] h-full flex flex-col z-10 \${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'p-4 md:p-6' : 'p-8 md:p-12'}\`}
          >`;

content = content.replace(target2, replace2);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched fade-in!");
