const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// 1. Container alignment
// Original: items-center justify-center border-b-[12px]
content = content.replace(
  "flex flex-col items-center justify-center border-b-[12px] border-slate-200",
  "flex flex-col ${quiz.mode === 'interactive' ? 'items-start justify-start' : 'items-center justify-center'} border-b-[12px] border-slate-200"
);

// 2. Inner row for image + question
// Original: flex flex-col md:flex-row items-center justify-center w-full
content = content.replace(
  "flex flex-col md:flex-row items-center justify-center w-full",
  "flex flex-col md:flex-row items-center ${quiz.mode === 'interactive' ? 'justify-start' : 'justify-center'} w-full"
);

// 3. Question text alignment
// Original: text-center leading-tight drop-shadow-sm flex-1
content = content.replace(
  "text-center leading-tight drop-shadow-sm flex-1",
  "${quiz.mode === 'interactive' ? 'text-left' : 'text-center'} leading-tight drop-shadow-sm flex-1"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
