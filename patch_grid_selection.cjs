const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /<button\s*key=\{idx\}\s*disabled=\{isAnswered\}\s*onClick=\{[^}]*\}\s*\}[^>]*>\s*\{idx \+ 1\}\s*<\/button>/;

const newButton = `<button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => {
                      audioSynth.playSwoosh();
                      setCurrentQuestionIndex(idx);
                      if (quiz.isMultiplayer && quiz.mode === 'interactive') {
                        setStage('question');
                      } else {
                        setStage('countdown');
                      }
                    }}
                    className={\`aspect-square rounded-3xl flex items-center justify-center text-4xl md:text-6xl font-black transition-all \${isAnswered ? 'bg-slate-500/40 text-slate-300/40 cursor-not-allowed border-4 border-slate-400/30 shadow-inner' : 'bg-white text-indigo-600 shadow-[0_10px_0_rgba(0,0,0,0.2)] hover:scale-105 active:translate-y-2 active:shadow-none'}\`}
                  >
                    {idx + 1}
                  </button>`;

content = content.replace(/<button\s*key=\{idx\}\s*disabled=\{isAnswered\}\s*onClick=\{[\s\S]*?<\/button>/, newButton);

fs.writeFileSync('src/components/Presentation.tsx', content);
