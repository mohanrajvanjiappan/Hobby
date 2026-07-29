const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Container
content = content.replace(
  "className={`w-[90vw] max-w-[1800px] h-full flex flex-col mx-auto z-10 ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'p-4 md:p-6' : 'p-8 md:p-12'}`}",
  "className={`${quiz.mode === 'interactive' ? 'w-[80vw] ml-4 md:ml-8 mr-auto' : 'w-[90vw] mx-auto'} max-w-[1800px] h-full flex flex-col z-10 ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'p-4 md:p-6' : 'p-8 md:p-12'}`}"
);

// Top Bar
content = content.replace(
  "className={`w-full flex justify-between items-center ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'mb-4 md:mb-6' : 'mb-10'}`}",
  "className={`w-full flex ${quiz.mode === 'interactive' ? 'justify-start gap-4 md:gap-6 flex-wrap' : 'justify-between'} items-center ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'mb-4 md:mb-6' : 'mb-10'}`}"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
