const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

code = code.replace(
  /bg-white\/95 backdrop-blur-3xl rounded-\[3rem\] shadow-\[0_40px_80px_rgba\(0,0,0,0\.2\)\] flex flex-col \$\{quiz.mode === 'interactive' \? 'items-start text-left justify-center' : 'items-center justify-center'\} border-t-\[4px\] border-white\/80 border-b-\[12px\] border-slate-200/,
  "bg-white/95 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] flex flex-col ${quiz.mode === 'interactive' ? 'items-start text-left justify-center' : 'items-center justify-center'} border-[8px] border-white/90 border-b-[16px] shadow-inner"
);

fs.writeFileSync('src/components/Presentation.tsx', code);
