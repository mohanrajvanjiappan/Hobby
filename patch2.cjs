const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');
content = content.replace(
  /<button\s+type="submit"\s+disabled=\{loading \|\| !topic\.trim\(\) \|\| \(quizType === 'identify-image' && !cacheSuccess\)\}[\s\S]*?<\/button>/,
  `
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="button"
              onClick={(e) => handleGenerate(e as any, 'video')}
              disabled={loading || !topic.trim() || (quizType === 'identify-image' && !cacheSuccess)}
              className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  Video Quiz
                </>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => handleGenerate(e as any, 'interactive')}
              disabled={loading || !topic.trim() || (quizType === 'identify-image' && !cacheSuccess)}
              className="flex-1 py-4 rounded-xl bg-fuchsia-600 text-white font-bold text-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 fill-current" />
                  Interactive Mode
                </>
              )}
            </button>
          </div>
  `
);
fs.writeFileSync('src/components/Setup.tsx', content);
