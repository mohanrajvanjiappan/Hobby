const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// 1. Wrap the Topic input in {needsTopic && (...)}
code = code.replace(
  /<div className="space-y-2">\s*<label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">\s*<BookOpen className="w-4 h-4 text-indigo-500" \/>\s*What is the topic\?\s*<\/label>\s*<input[\s\S]*?<\/div>/,
  `{needsTopic && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              What is the topic?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Dinosaurs, Space, Animals"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 bg-slate-50/50 text-slate-800 text-lg font-medium"
              required={needsTopic}
            />
          </div>
  )}`
);

const missingUIBlocks = `
          {((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice' || quizType === 'a-to-z') && (
            <div className="space-y-4 bg-indigo-50/50 p-6 rounded-2xl border-2 border-indigo-100">
              <label className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                Image Source
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIdentifyMode('auto')} className={\`flex-1 py-3 px-4 rounded-xl font-bold transition-all \${identifyMode === 'auto' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300'}\`}>AI Generate</button>
                <button type="button" onClick={() => setIdentifyMode('custom')} className={\`flex-1 py-3 px-4 rounded-xl font-bold transition-all \${identifyMode === 'custom' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300'}\`}>Upload Images</button>
                <button type="button" onClick={() => setIdentifyMode('json')} className={\`flex-1 py-3 px-4 rounded-xl font-bold transition-all \${identifyMode === 'json' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300'}\`}>Upload JSON</button>
              </div>

              {identifyMode === 'auto' && (quizType === 'identify-image' || quizType === 'blurred-image') && (
                <div className="space-y-4 mt-4">
                  <button type="button" onClick={handleCacheImages} disabled={caching || !topic.trim()} className="w-full py-3 rounded-xl bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition-all flex items-center justify-center gap-2">
                    {caching ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating & Caching Images...</> : <><Sparkles className="w-5 h-5" /> Pre-generate Images</>}
                  </button>
                  {cacheSuccess && <div className="text-sm text-emerald-600 font-medium text-center bg-emerald-50 p-2 rounded-lg">{cacheMessage || "Images successfully cached! Ready to play."}</div>}
                  {error && caching && <div className="text-sm text-red-600 font-medium text-center">{error}</div>}
                </div>
              )}

              {identifyMode === 'custom' && (
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Upload Images</label>
                    <button type="button" onClick={() => {
                       const input = document.createElement('input');
                       input.type = 'file'; input.multiple = true; input.accept = 'image/*';
                       input.onchange = async (e) => {
                         const files = Array.from((e.target as HTMLInputElement).files || []);
                         for (const file of files) {
                           const base64 = await new Promise<string>(resolve => { const r = new FileReader(); r.onload = (e) => resolve(e.target?.result as string); r.readAsDataURL(file); });
                           setCustomImages(prev => [...prev, { id: Math.random().toString(), file, base64, name: file.name.replace(/\\.[^/.]+$/, "") }]);
                         }
                       };
                       input.click();
                    }} className="text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">Browse Files</button>
                  </div>
                  {customImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {customImages.map((img, idx) => (
                         <div key={img.id} className="bg-white p-2 rounded-xl border-2 border-slate-100 flex flex-col gap-2">
                           <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                             <img src={img.base64} alt="preview" className="w-full h-full object-cover" />
                             <button type="button" onClick={() => setCustomImages(prev => prev.filter(c => c.id !== img.id))} className="absolute top-1 right-1 bg-white/80 p-1 rounded-md text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                           </div>
                           <input type="text" value={img.name} onChange={e => {
                             const n = [...customImages];
                             n[idx].name = e.target.value;
                             setCustomImages(n);
                           }} className="w-full px-2 py-1 text-sm border-2 border-slate-100 rounded-md focus:border-indigo-400 focus:outline-none" placeholder="Enter answer..." />
                         </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 text-center py-6 bg-white rounded-xl border-2 border-dashed border-slate-200">No images uploaded yet.</div>
                  )}
                </div>
              )}

              {identifyMode === 'json' && (
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">JSON File</label>
                    <div className="flex gap-2">
                       <button type="button" onClick={downloadJsonTemplate} className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 flex items-center gap-1"><Download className="w-4 h-4"/> Template</button>
                       <button type="button" onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file'; input.accept = '.json';
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            const text = await file.text();
                            try {
                              const json = JSON.parse(text);
                              const items = Array.isArray(json) ? json : (json.items || json.questions || []);
                              setJsonItems(items);
                              setJsonFileNames([file.name]);
                            } catch(err) {
                              setError("Invalid JSON format");
                            }
                          };
                          input.click();
                       }} className="text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center gap-1"><Upload className="w-4 h-4"/> Upload</button>
                    </div>
                  </div>
                  {jsonFileNames.length > 0 ? (
                    <div className="bg-white p-4 rounded-xl border-2 border-emerald-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600"><FileText className="w-5 h-5"/></div>
                        <div>
                          <div className="font-bold text-slate-700 text-sm">{jsonFileNames[0]}</div>
                          <div className="text-xs text-slate-500">{jsonItems.length} items loaded</div>
                        </div>
                      </div>
                      <button type="button" onClick={handleCacheImages} disabled={caching || cacheSuccess} className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-100">
                        {cacheSuccess ? "Images Cached" : caching ? "Caching..." : "Cache Images"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 text-center py-6 bg-white rounded-xl border-2 border-dashed border-slate-200">No JSON file loaded yet.</div>
                  )}
                </div>
              )}
            </div>
          )}
`;

code = code.replace(
  /(<div className="space-y-2">\s*<label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">\s*<Sparkles className="w-4 h-4 text-indigo-500" \/>\s*Quiz Type\s*<\/label>\s*<select[\s\S]*?<\/select>\s*<\/div>)/,
  `$1\n\n${missingUIBlocks}`
);

// We should also add Rules field (optional) if it doesn't exist
const rulesBlock = `
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Rules (Optional)
            </label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Enter quiz rules here. Each line will be a bullet point."
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 bg-slate-50/50 text-slate-800 text-lg font-medium min-h-[120px]"
            />
          </div>
`;

// Add Rules after the first Questions select / Voice/Music grids
if (!code.includes("Rules (Optional)")) {
    code = code.replace(
      /(<div className="grid grid-cols-2 gap-4">\s*<div className="space-y-2">\s*<label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">\s*<Settings className="w-4 h-4 text-indigo-500" \/>[\s\S]*?<\/div>\s*<\/div>)/,
      `$1\n\n${rulesBlock}`
    );
}

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Done");
