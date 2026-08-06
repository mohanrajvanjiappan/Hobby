const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /<div className="min-h-screen bg-slate-900 overflow-hidden flex flex-col relative select-none">/g,
  `<div className="min-h-screen bg-slate-900 overflow-hidden flex flex-col relative select-none">
      <div className="absolute top-0 left-0 bg-black text-white p-2 z-50 text-xs">
        DEBUG: Type={String(quiz.type)} Stage={stage}
      </div>`
);

fs.writeFileSync('src/components/Presentation.tsx', code);
