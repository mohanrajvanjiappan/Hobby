const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /<img\s+src=\{uploadedImages\[currentQuestionIndex\] \|\| question\.imageUrl\}\s+alt="Identify this"\s+className="w-full h-full object-contain bg-slate-50"/;

const newImg = `<img 
                        src={uploadedImages[currentQuestionIndex] || question.imageUrl} 
                        alt="Identify this" 
                        className="w-full h-full object-contain bg-slate-50 transition-all duration-1000 ease-in-out" 
                        style={getBlurStyle()}`;

code = code.replace(regex, newImg);
fs.writeFileSync('src/components/Presentation.tsx', code);
