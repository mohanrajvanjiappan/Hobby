const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Update isImageQuestion
code = code.replace("currentType === 'identify-image' ||", "currentType === 'identify-image' || currentType === 'blurred-image' ||");

// Update img className
const targetImg = `className="w-full h-full object-contain bg-slate-50"`;

const replacementImg = `className={\`w-full h-full object-contain bg-slate-50 transition-all duration-[2000ms] ease-out \${(currentType === 'blurred-image' && stage === 'question') ? (question.blurTechnique === 'heavy-blur' ? 'blur-2xl scale-125 opacity-80' : question.blurTechnique === 'pixelated-blur' ? 'blur-xl contrast-200 scale-125 saturate-200' : question.blurTechnique === 'grayscale-blur' ? 'blur-lg grayscale scale-110' : 'blur-xl scale-110') : 'blur-0 scale-100 contrast-100 grayscale-0 saturate-100 opacity-100'}\`}`;

code = code.replace(targetImg, replacementImg);

// Add to currentType checks for layout if needed
// Actually, `isImageQuestion` already covers it since it will be true. 
// But let's check for any `currentType === 'identify-image'` elsewhere? We did `grep "identify-image"` and there was only 1.

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done Presentation patch");
