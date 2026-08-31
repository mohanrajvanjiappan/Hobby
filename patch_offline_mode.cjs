const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// 1. Update setupMode type
code = code.replace(
  "const [setupMode, setSetupMode] = useState<'quiz' | 'presentation'>('quiz');",
  "const [setupMode, setSetupMode] = useState<'quiz' | 'presentation' | 'offline'>('quiz');"
);

// 2. Add FileUp to lucide-react imports if it's missing
if (!code.includes("FileUp")) {
    code = code.replace("MonitorPlay } from 'lucide-react';", "MonitorPlay, FileUp } from 'lucide-react';");
}

// 3. Add the third button
const origButtons = `              <button
                type="button"
                onClick={() => setSetupMode('presentation')}
                className={\`flex items-center gap-4 px-6 py-4 text-left font-bold rounded-2xl transition-all duration-300 border-2 \${setupMode === 'presentation' ? 'bg-white text-indigo-600 border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}\`}
              >
                <div className={\`p-2 rounded-xl \${setupMode === 'presentation' ? 'bg-indigo-100' : 'bg-white/10'}\`}><MonitorPlay className="w-6 h-6" /></div>
                <div className="flex flex-col"><span className="text-sm opacity-80 uppercase tracking-widest text-[10px]">Create</span><span className="text-lg">Presentation</span></div>
              </button>`;

const newButtons = origButtons + `
              <button
                type="button"
                onClick={() => setSetupMode('offline')}
                className={\`flex items-center gap-4 px-6 py-4 text-left font-bold rounded-2xl transition-all duration-300 border-2 \${setupMode === 'offline' ? 'bg-white text-indigo-600 border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}\`}
              >
                <div className={\`p-2 rounded-xl \${setupMode === 'offline' ? 'bg-indigo-100' : 'bg-white/10'}\`}><FileUp className="w-6 h-6" /></div>
                <div className="flex flex-col"><span className="text-sm opacity-80 uppercase tracking-widest text-[10px]">Import</span><span className="text-lg">Offline Custom</span></div>
              </button>`;

code = code.replace(origButtons, newButtons);

// 4. Add the offline section
const offlineBlock = `
        {setupMode === 'offline' && !pendingInteractiveQuiz && !loadedOfflineQuiz ? (
          <form className="p-8 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FileUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Offline Quiz</h2>
                <p className="text-slate-500 font-medium text-sm">Upload JSON to create custom quizzes</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4 bg-indigo-50/50 p-6 rounded-2xl border-2 border-indigo-100">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-indigo-900 uppercase tracking-wider">JSON Files</label>
                <button type="button" onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }} className="text-indigo-600 font-bold text-sm bg-white px-4 py-2 rounded-xl hover:bg-indigo-50 border-2 border-indigo-100 shadow-sm transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4"/> Upload Files
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                multiple
                className="hidden"
              />
              
              {uploadedFileList.length > 0 ? (
                <div className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {uploadedFileList.map((file, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border-2 border-emerald-100 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600"><FileText className="w-5 h-5"/></div>
                        <div>
                          <div className="font-bold text-slate-700 text-sm truncate max-w-[200px]">{file.fileName}</div>
                          <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                            {file.questions.length} questions
                          </div>
                        </div>
                      </div>
                      <button type="button" onClick={() => setUploadedFileList(prev => prev.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-medium text-slate-500 text-center py-10 bg-white rounded-xl border-2 border-dashed border-indigo-200">
                  <FileUp className="w-8 h-8 mx-auto mb-3 text-indigo-300" />
                  No JSON files uploaded yet.<br/>Click "Upload Files" to select custom quiz files.
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleStartUploadedFiles('interactive')}
                disabled={uploadedFileList.length === 0}
                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-6 h-6" />
                Start Offline Quiz
              </button>
            </div>
          </form>
        ) : `;

code = code.replace(
  "{setupMode === 'presentation' && !pendingInteractiveQuiz && !loadedOfflineQuiz ? (",
  offlineBlock + "\n        {setupMode === 'presentation' && !pendingInteractiveQuiz && !loadedOfflineQuiz ? ("
);

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Done patching offline mode.");
