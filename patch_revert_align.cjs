const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Intro
content = content.replace(
  "className={`p-12 max-w-5xl flex flex-col h-full z-10 w-[80vw] ${quiz.mode === 'interactive' ? 'items-start text-left ml-4 md:ml-8 mr-auto justify-center' : 'items-center text-center mx-auto justify-center'}`}",
  "className=\"text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10 mx-auto\""
);

// Warmup
content = content.replace(
  "className={`p-12 max-w-4xl flex flex-col h-full z-10 ${quiz.mode === 'interactive' ? 'items-start text-left ml-4 md:ml-8 mr-auto w-[80vw]' : 'items-center text-center mx-auto w-full'} justify-center`}",
  "className=\"text-center p-12 max-w-4xl flex flex-col items-center justify-center h-full z-10 w-full mx-auto\""
);

// Countdown
content = content.replace(
  "className={`p-12 flex flex-col h-full z-10 ${quiz.mode === 'interactive' ? 'items-start text-left ml-4 md:ml-8 mr-auto w-[80vw]' : 'items-center text-center mx-auto w-full'} justify-center`}",
  "className=\"text-center p-12 flex flex-col items-center justify-center h-full z-10 w-full mx-auto\""
);

// Outro
content = content.replace(
  "className={`p-12 max-w-5xl flex flex-col h-full z-10 w-[80vw] ${quiz.mode === 'interactive' ? 'items-start text-left ml-4 md:ml-8 mr-auto justify-center' : 'items-center text-center mx-auto justify-center'}`}",
  "className=\"text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10 mx-auto\""
);

content = content.replace(
  "<div className={`relative mb-8 flex ${quiz.mode === 'interactive' ? 'justify-start' : 'justify-center'} items-center`}>",
  "<div className=\"relative mb-8 flex justify-center items-center\">"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
