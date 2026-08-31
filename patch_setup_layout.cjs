const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// 1. Replace the outer container
const oldWrapper = `<div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100"
      >`;

const newWrapper = `<div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row p-4 md:p-8 lg:p-12 gap-8 font-sans items-start justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100/60 ring-1 ring-slate-900/5"
      >`;

code = code.replace(oldWrapper, newWrapper);

// 2. Replace the left column / header (indigo-600 block)
const oldHeader = `<div className="bg-indigo-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Generator</h1>
          <p className="text-indigo-100 text-sm">Generate engaging YouTube-ready quizzes and presentations</p>
          
          <div className="flex bg-indigo-700/50 rounded-lg p-1 mt-6">
            <button
              type="button"
              onClick={() => setSetupMode('quiz')}
              className={\`flex-1 py-2 text-sm font-bold rounded-md transition-all \${setupMode === 'quiz' ? 'bg-white shadow-sm text-indigo-600' : 'text-indigo-100 hover:text-white'}\`}
            >
              Quiz Maker
            </button>
            <button
              type="button"
              onClick={() => setSetupMode('presentation')}
              className={\`flex-1 py-2 text-sm font-bold rounded-md transition-all \${setupMode === 'presentation' ? 'bg-white shadow-sm text-indigo-600' : 'text-indigo-100 hover:text-white'}\`}
            >
              Presentation
            </button>
          </div>
        </div>`;

const newHeader = `<div className="lg:w-2/5 xl:w-1/3 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 p-10 lg:p-12 text-white flex flex-col relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-white/10 mb-8 backdrop-blur-md shadow-inner shadow-white/20 border border-white/20">
              <Sparkles className="w-10 h-10 text-white drop-shadow-md" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Content<br/>Studio</h1>
            <p className="text-indigo-100 text-lg leading-relaxed mb-12 font-medium opacity-90">Design beautiful, interactive YouTube quizzes and presentations with AI.</p>
            
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setSetupMode('quiz')}
                className={\`flex items-center gap-4 px-6 py-4 text-left font-bold rounded-2xl transition-all duration-300 border-2 \${setupMode === 'quiz' ? 'bg-white text-indigo-600 border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}\`}
              >
                <div className={\`p-2 rounded-xl \${setupMode === 'quiz' ? 'bg-indigo-100' : 'bg-white/10'}\`}><Gamepad2 className="w-6 h-6" /></div>
                <div className="flex flex-col"><span className="text-sm opacity-80 uppercase tracking-widest text-[10px]">Create</span><span className="text-lg">Quiz Maker</span></div>
              </button>
              <button
                type="button"
                onClick={() => setSetupMode('presentation')}
                className={\`flex items-center gap-4 px-6 py-4 text-left font-bold rounded-2xl transition-all duration-300 border-2 \${setupMode === 'presentation' ? 'bg-white text-indigo-600 border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}\`}
              >
                <div className={\`p-2 rounded-xl \${setupMode === 'presentation' ? 'bg-indigo-100' : 'bg-white/10'}\`}><MonitorPlay className="w-6 h-6" /></div>
                <div className="flex flex-col"><span className="text-sm opacity-80 uppercase tracking-widest text-[10px]">Create</span><span className="text-lg">Presentation</span></div>
              </button>
            </div>
          </div>
          
          <div className="relative z-10 mt-12 pt-8 border-t border-white/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm font-medium text-indigo-100">System Ready</span>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-[85vh] overflow-y-auto custom-scrollbar relative bg-white">`;

code = code.replace(oldHeader, newHeader);

// We need to add Gamepad2 and MonitorPlay to imports
code = code.replace("Sparkles, User, Brain", "Sparkles, User, Brain, Gamepad2, MonitorPlay");

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Done");
