const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(
  "className={`${quiz.mode === 'interactive' ? 'w-[80vw] ml-4 md:ml-8 mr-auto' : 'w-[90vw] mx-auto'} max-w-[1800px] h-full flex flex-col z-10",
  "className={`${quiz.mode === 'interactive' ? 'w-[80vw] ml-4 md:ml-8 mr-auto justify-center' : 'w-[90vw] mx-auto'} max-w-[1800px] h-full flex flex-col z-10"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
