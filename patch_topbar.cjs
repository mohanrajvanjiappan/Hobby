const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /<div className="bg-indigo-700 text-white px-8 py-3 rounded-full shadow-2xl font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-indigo-400">/;
const newCode = `{quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && (
                <div className="bg-fuchsia-600 text-white px-8 py-3 rounded-full shadow-2xl font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-fuchsia-400">
                  <span className="animate-pulse">👉 {playersState[currentPlayerIndex]?.name}'s Turn</span>
                </div>
              )}
              <div className="bg-indigo-700 text-white px-8 py-3 rounded-full shadow-2xl font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-indigo-400">`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/components/Presentation.tsx', content);
