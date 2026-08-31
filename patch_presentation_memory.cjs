const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

// Replace the slice count
code = code.replace(/slice\(0, 10\)/g, "slice(0, quiz.memoryBreakImageCount || 10)");

// Find the grid container for memory-break
const targetGrid = `<div className="grid grid-cols-5 grid-rows-2 gap-6 md:gap-8 w-full flex-1 min-h-0">
                  {memoryItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-white/10 backdrop-blur-md border-4 border-white/20 rounded-[2.5rem] w-full h-full flex items-center justify-center text-[6rem] md:text-[8rem] lg:text-[10rem] shadow-2xl relative cursor-pointer"`;

const replaceGrid = `<div className="flex flex-wrap justify-center items-center content-center gap-4 md:gap-6 w-full flex-1 min-h-0 py-4">
                  {memoryItems.map((item, idx) => {
                    const count = memoryItems.length;
                    const sizeClass = count <= 6 ? 'w-32 h-32 md:w-48 md:h-48 text-[5rem] md:text-[7rem]' : count <= 10 ? 'w-28 h-28 md:w-40 md:h-40 text-[4rem] md:text-[6rem]' : count <= 15 ? 'w-24 h-24 md:w-32 md:h-32 text-[3rem] md:text-[5rem]' : 'w-20 h-20 md:w-28 md:h-28 text-[2.5rem] md:text-[4rem]';
                    return (
                    <motion.div
                      key={idx}
                      className={\`bg-white/10 backdrop-blur-md border-4 border-white/20 rounded-3xl flex items-center justify-center shadow-xl relative cursor-pointer \${sizeClass}\`}
                      style={{ flexShrink: 0 }}`;

code = code.replace(targetGrid, replaceGrid);

fs.writeFileSync('src/components/Presentation.tsx', code);
