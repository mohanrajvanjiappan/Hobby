const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const target = `                  onClick={() => {
                    audioSynth.playSwoosh();
                    setStage('countdown');
                  }}
                  className="px-12 py-6 rounded-full bg-white text-indigo-900 font-black text-3xl shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform flex items-center gap-4 mt-8"`;
const replace = `                  onClick={() => {
                    audioSynth.playSwoosh();
                    if (categories.length > 1) {
                      setStage('category-selection');
                    } else {
                      setStage('question-selection');
                    }
                  }}
                  className="px-12 py-6 rounded-full bg-white text-indigo-900 font-black text-3xl shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform flex items-center gap-4 mt-8"`;
content = content.replace(target, replace);
fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched warmup button!");
