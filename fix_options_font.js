import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /px-6 py-5 md:px-8 md:py-6 rounded-3xl text-3xl md:text-4xl lg:text-5xl font-bold/g,
  "px-6 py-5 md:px-8 md:py-6 rounded-3xl text-5xl md:text-6xl lg:text-7xl font-bold p-6"
);

code = code.replace(
  /px-4 py-3 md:px-6 md:py-4 rounded-2xl text-xl md:text-2xl lg:text-3xl font-bold/g,
  "px-4 py-3 md:px-6 md:py-4 rounded-2xl text-4xl md:text-5xl lg:text-6xl font-bold p-4"
);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Patched options font size");
