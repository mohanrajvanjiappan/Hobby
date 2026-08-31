const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const submitButtons = `
          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-6 border-t-2 border-slate-100">
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="flex-1 py-5 rounded-2xl bg-indigo-600 text-white font-black text-xl hover:bg-indigo-700 hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(79,70,229,0.3)] active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating AI Quiz...
                </>
              ) : (
                <>
                  <Play className="w-7 h-7 fill-current" />
                  Start Video Quiz
                </>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => handleGenerate(e as any, 'interactive')}
              disabled={loading || !topic.trim()}
              className="flex-1 py-5 rounded-2xl bg-fuchsia-600 text-white font-black text-xl hover:bg-fuchsia-700 hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(192,38,211,0.3)] active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating AI Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="w-7 h-7 fill-current" />
                  Interactive Mode
                </>
              )}
            </button>
          </div>
        </form>`;

code = code.replace("             </div>\n          )}\n        </form>", "             </div>\n          )}\n" + submitButtons);

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Done");
