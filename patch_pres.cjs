const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Update isImageQuestion
code = code.replace("currentType === 'identify-image' ||", "currentType === 'identify-image' || currentType === 'blurred-image' ||");

// Now let's find the img rendering code:
// <img src={uploadedImages[currentQuestionIndex] || question.imageUrl} alt="Identify this" className="w-full h-full object-contain bg-slate-50" crossOrigin="anonymous" referrerPolicy="no-referrer" onError=...
// We want to apply a dynamic style to it.

// Let's replace the className of the img if it's blurred-image
const targetImg = `className="w-full h-full object-contain bg-slate-50"`;

const replacementImg = `className={\`w-full h-full object-contain bg-slate-50 transition-all duration-[3000ms] ease-out \${(currentType === 'blurred-image' && stage === 'question') ? (question.blurTechnique === 'heavy-blur' ? 'blur-xl scale-110 opacity-80' : question.blurTechnique === 'pixelated-blur' ? 'blur-lg contrast-150 scale-110 saturate-200' : question.blurTechnique === 'grayscale-blur' ? 'blur-md grayscale scale-105' : 'blur-lg scale-110') : 'blur-0 scale-100 contrast-100 grayscale-0 saturate-100 opacity-100'}\`}`;

// Wait, doing class replacement like that is safe if it's the exact match. Let's see if there are multiple.
