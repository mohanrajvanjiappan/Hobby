const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /<img \n                        src=\{uploadedImages\[currentQuestionIndex\] \|\| question\.imageUrl\} \n                        alt="Identify this" \n                        className=\{\`w-full h-full object-contain bg-slate-50 transition-all duration-\[2000ms\] ease-out \$\{\(currentType === 'blurred-image' && stage === 'question'\) \? \(question\.blurTechnique === 'heavy-blur' \? 'blur-lg scale-110 opacity-90' : question\.blurTechnique === 'pixelated-blur' \? 'blur-md contrast-150 scale-110 saturate-150' : question\.blurTechnique === 'grayscale-blur' \? 'blur-sm grayscale scale-105' : 'blur-md scale-105'\) : 'blur-0 scale-100 contrast-100 grayscale-0 saturate-100 opacity-100'\}\`\} \n                        crossOrigin="anonymous"\n                        referrerPolicy="no-referrer"\n                        onError=\{\(e\) => \{ if \(question\.imagePreviewUrl && e\.currentTarget\.src !== question\.imagePreviewUrl\) \{ e\.currentTarget\.src = question\.imagePreviewUrl; \} else \{ setImageError\(true\); \} \}\}/;

const replacement = `<motion.img 
                        src={uploadedImages[currentQuestionIndex] || question.imageUrl} 
                        alt="Identify this" 
                        animate={quiz.mode === 'video' ? { x: [0, 8, -8, 4, -4, 0], y: [0, -8, 8, -4, 4, 0] } : {}}
                        transition={quiz.mode === 'video' ? { repeat: Infinity, duration: 6, ease: "easeInOut" } : {}}
                        className={\`w-full h-full object-contain bg-slate-50 transition-all duration-[2000ms] ease-out \${(currentType === 'blurred-image' && stage === 'question') ? (question.blurTechnique === 'heavy-blur' ? 'blur-lg scale-110 opacity-90' : question.blurTechnique === 'pixelated-blur' ? 'blur-md contrast-150 scale-110 saturate-150' : question.blurTechnique === 'grayscale-blur' ? 'blur-sm grayscale scale-105' : 'blur-md scale-105') : 'blur-0 scale-100 contrast-100 grayscale-0 saturate-100 opacity-100'}\`} 
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => { if (question.imagePreviewUrl && e.currentTarget.src !== question.imagePreviewUrl) { e.currentTarget.src = question.imagePreviewUrl; } else { setImageError(true); } }}`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done");
