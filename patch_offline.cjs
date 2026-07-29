const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const oldOffline = `            <button
              type="button"
              onClick={() => onQuizGenerated(loadedOfflineQuiz)}
              className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all flex items-center justify-center gap-2 mt-8 shadow-lg shadow-emerald-600/20"
            >
              <Play className="w-6 h-6 fill-current" />
              Ready to Go!
            </button>`;

const newOffline = `            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="button"
                onClick={() => onQuizGenerated({ ...loadedOfflineQuiz, mode: 'video' })}
                className="flex-1 py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Play className="w-6 h-6 fill-current" />
                Video Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingInteractiveQuiz({ ...loadedOfflineQuiz, mode: 'interactive' });
                  setLoadedOfflineQuiz(null);
                }}
                className="flex-1 py-4 rounded-xl bg-fuchsia-600 text-white font-bold text-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/20"
              >
                <Sparkles className="w-6 h-6 fill-current" />
                Interactive Mode
              </button>
            </div>`;

content = content.replace(oldOffline, newOffline);
fs.writeFileSync('src/components/Setup.tsx', content);
