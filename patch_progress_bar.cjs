const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const targetStr = `            <div className={\`w-full flex \${quiz.mode === 'interactive' ? 'justify-start gap-4 md:gap-6 flex-wrap' : 'justify-between'} items-center \${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'mb-4 md:mb-6' : 'mb-10'}\`}>`;

const replaceStr = `            {/* Milestone Progress Bar */}
            <div className="w-full mb-6 mt-2">
              <div className="flex justify-between text-white/90 font-bold mb-2 text-sm uppercase tracking-wider">
                <span>Milestone Progress</span>
                <span>{Math.floor(currentQuestionIndex / 5)} of {Math.ceil(quiz.questions.length / 5)} Badges</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-yellow-500"
                  initial={{ width: \`\${(Math.max(0, currentQuestionIndex) / quiz.questions.length) * 100}%\` }}
                  animate={{ width: \`\${((currentQuestionIndex + (stage === 'reveal' ? 1 : 0)) / quiz.questions.length) * 100}%\` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                {/* Milestone markers */}
                {Array.from({ length: Math.ceil(quiz.questions.length / 5) }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute top-0 w-1 h-full bg-white/40 shadow-sm" 
                    style={{ left: \`\${((i + 1) * 5 / quiz.questions.length) * 100}%\` }} 
                  />
                ))}
              </div>
            </div>
            
            {/* Top Bar */}
            <div className={\`w-full flex \${quiz.mode === 'interactive' ? 'justify-start gap-4 md:gap-6 flex-wrap' : 'justify-between'} items-center \${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'mb-4 md:mb-6' : 'mb-10'}\`}>`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched progress bar!");
