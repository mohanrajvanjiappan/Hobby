const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// Add states
content = content.replace(
  "const [teamName, setTeamName] = useState('');",
  "const [teamName, setTeamName] = useState('');\n  const [identifyMode, setIdentifyMode] = useState<'auto' | 'custom'>('auto');\n  const [customImages, setCustomImages] = useState<{ id: string; file: File; base64: string; name: string }[]>([]);"
);

// Add custom images import for Trash icon
content = content.replace(
  "import { Settings, Play, Loader2, Sparkles, BookOpen, Clock, Mic, Music, Download, Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';",
  "import { Settings, Play, Loader2, Sparkles, BookOpen, Clock, Mic, Music, Download, Upload, Image as ImageIcon, CheckCircle2, Trash2, Plus } from 'lucide-react';"
);

// Update handleGenerate
content = content.replace(
  "    try {\n      const response = await fetch('/api/generate-quiz', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ topic, numQuestions: quizType === 'mega-quiz' ? 100 : numQuestions, difficulty, quizType }),\n      });",
  "    try {\n      const payload: any = { topic, numQuestions: quizType === 'mega-quiz' ? 100 : numQuestions, difficulty, quizType };\n      if (quizType === 'identify-image' && identifyMode === 'custom') {\n        payload.customItems = customImages.map(img => ({ id: img.id, name: img.name }));\n      }\n      const response = await fetch('/api/generate-quiz', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(payload),\n      });"
);

// If custom mode, attach images to returned quiz
content = content.replace(
  "      data.mode = mode;\n      \n      if (mode === 'interactive') {",
  "      data.mode = mode;\n      \n      if (quizType === 'identify-image' && identifyMode === 'custom') {\n        data.questions = data.questions.map((q: any) => {\n          const matched = customImages.find(c => c.id === q.id);\n          if (matched) {\n            q.imageUrl = matched.base64;\n            q.imagePreviewUrl = matched.base64;\n          }\n          return q;\n        });\n      }\n\n      if (mode === 'interactive') {"
);

// Update conditions for disabled buttons
content = content.replace(
  /disabled=\{loading \|\| \!topic\.trim\(\) \|\| \(quizType === 'identify-image' && \!cacheSuccess\)\}/g, 
  "disabled={loading || !topic.trim() || (quizType === 'identify-image' && identifyMode === 'auto' && !cacheSuccess) || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim())))}"
);

// UI Changes
const oldUI = `          {quizType === 'identify-image' && (
            <button
              type="button"
              onClick={handleCacheImages}
              disabled={caching || !topic.trim()}
              className="w-full py-4 rounded-xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-lg shadow-slate-800/20"
            >
              {caching ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Fetching Images...
                </>
              ) : cacheSuccess ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  Images Cached!
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6" />
                  Pre-fetch & Cache Images
                </>
              )}
            </button>
          )}`;

const newUI = `          {quizType === 'identify-image' && (
            <div className="mt-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-4">
              <div className="flex gap-2 p-1 bg-neutral-200/50 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIdentifyMode('auto')}
                  className={\`flex-1 py-2 text-sm font-bold rounded-md transition-all \${identifyMode === 'auto' ? 'bg-white shadow-sm text-indigo-600' : 'text-neutral-500 hover:text-neutral-700'}\`}
                >
                  AI Auto-Fetch
                </button>
                <button
                  type="button"
                  onClick={() => setIdentifyMode('custom')}
                  className={\`flex-1 py-2 text-sm font-bold rounded-md transition-all \${identifyMode === 'custom' ? 'bg-white shadow-sm text-indigo-600' : 'text-neutral-500 hover:text-neutral-700'}\`}
                >
                  Custom Upload
                </button>
              </div>

              {identifyMode === 'auto' && (
                <button
                  type="button"
                  onClick={handleCacheImages}
                  disabled={caching || !topic.trim()}
                  className="w-full py-4 rounded-xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-800/20"
                >
                  {caching ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Fetching Images...
                    </>
                  ) : cacheSuccess ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                      Images Cached!
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6" />
                      Pre-fetch & Cache Images
                    </>
                  )}
                </button>
              )}

              {identifyMode === 'custom' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-600">Upload up to 25 Images</span>
                    <label className="cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Images
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const remaining = 25 - customImages.length;
                          const toAdd = files.slice(0, remaining);
                          toAdd.forEach(file => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setCustomImages(prev => [...prev, {
                                id: Math.random().toString(36).substring(2, 11),
                                file,
                                base64: event.target?.result as string,
                                name: ''
                              }]);
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      />
                    </label>
                  </div>
                  
                  {customImages.length > 0 && (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {customImages.map((img, idx) => (
                        <div key={img.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                          <img src={img.base64} alt="preview" className="w-12 h-12 object-cover rounded-md" />
                          <input 
                            type="text" 
                            placeholder="Correct Answer (e.g. Apple Logo)" 
                            value={img.name}
                            onChange={(e) => {
                              setCustomImages(prev => {
                                const next = [...prev];
                                next[idx].name = e.target.value;
                                return next;
                              });
                            }}
                            className="flex-1 px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setCustomImages(prev => prev.filter((_, i) => i !== idx))}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}`;

content = content.replace(oldUI, newUI);

fs.writeFileSync('src/components/Setup.tsx', content);
