const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');
content = content.replace(
  /<form onSubmit=\{handleGenerate\} className="p-8 space-y-6">/,
  `
        ) : pendingInteractiveQuiz ? (
          <div className="p-8 text-center space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Enter User / Team Name</h2>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="E.g., The Brainiacs"
              className="w-full px-4 py-4 text-center text-xl rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              autoFocus
            />
            
            <button
              type="button"
              onClick={() => {
                const finalQuiz = { ...pendingInteractiveQuiz, teamName: teamName || 'Player 1' };
                onQuizGenerated(finalQuiz);
              }}
              className="w-full py-4 rounded-xl bg-fuchsia-600 text-white font-bold text-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all flex items-center justify-center gap-2 mt-8 shadow-lg shadow-fuchsia-600/20"
            >
              <Play className="w-6 h-6 fill-current" />
              Start Interactive Quiz!
            </button>
            
            <button
              type="button"
              onClick={() => setPendingInteractiveQuiz(null)}
              className="w-full py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all mt-4"
            >
              Cancel
            </button>
          </div>
        ) : (
        <form onSubmit={(e) => handleGenerate(e, 'video')} className="p-8 space-y-6">
  `
);
fs.writeFileSync('src/components/Setup.tsx', content);
