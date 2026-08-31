const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const targetImg = "className={`w-full h-full object-contain bg-slate-50 transition-all duration-[2000ms] ease-out ${(currentType === 'blurred-image' && stage === 'question') ? (question.blurTechnique === 'heavy-blur' ? 'blur-2xl scale-125 opacity-80' : question.blurTechnique === 'pixelated-blur' ? 'blur-xl contrast-200 scale-125 saturate-200' : question.blurTechnique === 'grayscale-blur' ? 'blur-lg grayscale scale-110' : 'blur-xl scale-110') : 'blur-0 scale-100 contrast-100 grayscale-0 saturate-100 opacity-100'}`}";

const replacementImg = "className={`w-full h-full object-contain bg-slate-50 transition-all duration-[2000ms] ease-out ${(currentType === 'blurred-image' && stage === 'question') ? (question.blurTechnique === 'heavy-blur' ? 'blur-lg scale-110 opacity-90' : question.blurTechnique === 'pixelated-blur' ? 'blur-md contrast-150 scale-110 saturate-150' : question.blurTechnique === 'grayscale-blur' ? 'blur-sm grayscale scale-105' : 'blur-md scale-105') : 'blur-0 scale-100 contrast-100 grayscale-0 saturate-100 opacity-100'}`}";

code = code.replace(targetImg, replacementImg);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done");
