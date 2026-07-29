const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Outro
content = content.replace(
  "className=\"text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10\"",
  "className={`p-12 max-w-5xl flex flex-col h-full z-10 w-[80vw] ${quiz.mode === 'interactive' ? 'items-start text-left ml-4 md:ml-8 mr-auto justify-center' : 'items-center text-center mx-auto justify-center'}`}"
);

// We need to also fix the Trophy icon alignment for the interactive outro
content = content.replace(
  "<div className=\"relative mb-8 flex justify-center items-center\">",
  "<div className={`relative mb-8 flex ${quiz.mode === 'interactive' ? 'justify-start' : 'justify-center'} items-center`}>"
);

// Let's also check Quote screen
content = content.replace(
  "className=\"text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10\"",
  "className={`p-12 max-w-5xl flex flex-col h-full z-10 w-[80vw] ${quiz.mode === 'interactive' ? 'items-start text-left ml-4 md:ml-8 mr-auto justify-center' : 'items-center text-center mx-auto justify-center'}`}"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
