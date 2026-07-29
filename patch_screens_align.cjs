const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Intro
content = content.replace(
  "className=\"text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10\"",
  "className={`p-12 max-w-5xl flex flex-col h-full z-10 w-[80vw] ${quiz.mode === 'interactive' ? 'items-start text-left ml-4 md:ml-8 mr-auto justify-center' : 'items-center text-center mx-auto justify-center'}`}"
);

// Warmup
content = content.replace(
  "className=\"text-center p-12 max-w-4xl flex flex-col items-center justify-center h-full z-10 w-full\"",
  "className={`p-12 max-w-4xl flex flex-col h-full z-10 ${quiz.mode === 'interactive' ? 'items-start text-left ml-4 md:ml-8 mr-auto w-[80vw]' : 'items-center text-center mx-auto w-full'} justify-center`}"
);

// Countdown
content = content.replace(
  "className=\"text-center p-12 flex flex-col items-center justify-center h-full z-10 w-full\"",
  "className={`p-12 flex flex-col h-full z-10 ${quiz.mode === 'interactive' ? 'items-start text-left ml-4 md:ml-8 mr-auto w-[80vw]' : 'items-center text-center mx-auto w-full'} justify-center`}"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
