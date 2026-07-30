const fs = require('fs');
const content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');
const searchPoint = `              {quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && (
                <div className="bg-fuchsia-600 text-white px-8 py-3 rounded-full shadow-2xl font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-fuchsia-400">
                  <span className="animate-pulse">👉 {playersState[currentPlayerIndex]?.name}'s Turn</span>
                </div>
              )}`;

const btn = `              {quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && (
                <div className="bg-fuchsia-600 text-white px-8 py-3 rounded-full shadow-2xl font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-fuchsia-400">
                  <span className="animate-pulse">👉 {playersState[currentPlayerIndex]?.name}'s Turn</span>
                </div>
              )}
              {quiz.mode === 'interactive' && question.options && question.options.length > 2 && (stage === 'question' || stage === 'reveal') && (
                <button
                  onClick={handleFiftyFifty}
                  disabled={stage === 'reveal' || usedFiftyFifty[\`\${currentPlayerIndex}-\${question.category || 'default'}\`]}
                  className={\`px-6 py-3 rounded-full font-black text-xl uppercase tracking-widest flex items-center gap-2 border-4 transition-all shadow-2xl \${usedFiftyFifty[\`\${currentPlayerIndex}-\${question.category || 'default'}\`] ? 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-white border-amber-600 active:scale-95'}\`}
                  title={usedFiftyFifty[\`\${currentPlayerIndex}-\${question.category || 'default'}\`] ? "50/50 already used in this category" : "Use 50/50 Lifeline"}
                >
                  <Lightbulb className="w-6 h-6" /> 50/50
                </button>
              )}`;
fs.writeFileSync('src/components/Presentation.tsx', content.replace(searchPoint, btn));
