const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// For the container wrapper
content = content.replace(
  "className={`${quiz.mode === 'interactive' ? 'w-[80vw] ml-4 md:ml-8 mr-auto justify-center' : 'w-[90vw] mx-auto'} max-w-[1800px] h-full flex flex-col z-10 ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'p-4 md:p-6' : 'p-8 md:p-12'}`}",
  "className={`${quiz.mode === 'interactive' ? 'w-[80vw] ml-4 md:ml-8 mr-auto justify-center' : 'w-[90vw] mx-auto'} max-w-[1800px] h-full flex flex-col z-10 ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'p-4 md:p-6' : 'p-8 md:p-12'}`}"
);

// For the question card wrapper
content = content.replace(
  "quiz.type === 'find-in-map' ? 'px-6 pb-6 md:px-8 md:pb-8 mb-6 flex-1 gap-6' : 'px-8 pb-8 md:px-12 md:pb-12 mb-8 flex-1 gap-8'",
  "quiz.type === 'find-in-map' ? `px-6 pb-6 md:px-8 md:pb-8 mb-6 ${quiz.mode === 'interactive' ? 'shrink-0' : 'flex-1'} gap-6` : `px-8 pb-8 md:px-12 md:pb-12 mb-8 ${quiz.mode === 'interactive' ? 'shrink-0' : 'flex-1'} gap-8`"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
