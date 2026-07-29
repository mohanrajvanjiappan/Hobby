const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(
  "flex flex-col ${quiz.mode === 'interactive' ? 'items-start justify-start' : 'items-center justify-center'} border-b-[12px] border-slate-200",
  "flex flex-col ${quiz.mode === 'interactive' ? 'items-start justify-center' : 'items-center justify-center'} border-b-[12px] border-slate-200"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
