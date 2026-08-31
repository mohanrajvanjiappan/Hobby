import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// 1. Font size of question text
code = code.replace(
  /'text-4xl md:text-5xl lg:text-6xl' : 'text-5xl md:text-6xl lg:text-7xl'/g,
  "'text-5xl md:text-6xl lg:text-[5rem] overflow-y-auto max-h-[40vh] p-4' : 'text-6xl md:text-7xl lg:text-[6rem] overflow-y-auto max-h-[40vh] p-4'"
);

// 2. Options font size
code = code.replace(
  /'px-6 py-5 md:px-8 md:py-6 rounded-3xl text-3xl md:text-4xl lg:text-5xl font-bold/g,
  "'px-6 py-5 md:px-8 md:py-6 rounded-3xl text-4xl md:text-5xl lg:text-6xl font-bold"
);

code = code.replace(
  /'px-4 py-3 md:px-6 md:py-4 rounded-2xl text-xl md:text-2xl lg:text-3xl font-bold/g,
  "'px-4 py-3 md:px-6 md:py-4 rounded-2xl text-2xl md:text-4xl lg:text-[2.5rem] font-bold"
);

// 3. Panel size
// Replace the outer container sizing
code = code.replace(
  /w-\[90vw\] mx-auto'\} max-w-\[1800px\] h-full flex flex-col z-10/g,
  "w-[90vw] mx-auto'} max-w-[1800px] h-[90vh] mt-[5vh] flex flex-col z-10"
);

code = code.replace(
  /flex flex-col \$\{quiz\.mode === 'interactive' \? 'items-start text-left justify-center' : 'items-center justify-center'\} border-b-\[12px\] border-slate-200/g,
  "flex flex-col ${quiz.mode === 'interactive' ? 'items-start text-left justify-center' : 'items-center justify-center'} border-b-[12px] border-slate-200 flex-1 min-h-[70vh] overflow-hidden"
);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Patched fonts and panel size");
