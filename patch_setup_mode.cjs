const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const importRegex = /import React, \{ useState, useRef, useEffect \} from 'react';/;
content = content.replace(importRegex, "import React, { useState, useRef, useEffect } from 'react';\nimport { FileText } from 'lucide-react';");

const stateRegex = /const \[participantTopic, setParticipantTopic\] = useState\(''\);/;
const newStates = `const [participantTopic, setParticipantTopic] = useState('');
  const [setupMode, setSetupMode] = useState<'quiz' | 'presentation'>('quiz');
  const [presentationContent, setPresentationContent] = useState('');
  const [presentationDuration, setPresentationDuration] = useState(5);`;
content = content.replace(stateRegex, newStates);

const handleGeneratePresentation = `
  const handleGeneratePresentation = async (e: React.FormEvent, mode: 'video' | 'interactive' = 'video') => {
    e.preventDefault();
    if (!presentationContent.trim()) return;
    
    // Prime speech synthesis on user click
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    }
    
    audioSynth.setVoicePreference(voicePreference);
    audioSynth.setMusicPreference(musicEnabled);

    if (mode === 'interactive') {
      setPendingInteractiveQuiz({
        mode: 'interactive',
        title: "Animated Presentation",
        topic: "Presentation",
        theme: {
          primaryColor: "#4F46E5",
          secondaryColor: "#10B981",
          textColor: "#ffffff"
        },
        questions: [],
        quotes: [],
        type: 'text-presentation',
        isOfflineMode: false,
      } as any);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: presentationContent, duration: presentationDuration }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate presentation');
      }
      
      onQuizGenerated({ ...data, mode });
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating.');
    } finally {
      setLoading(false);
    }
  };
`;

const renderRegex = /return \(\s*<div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">\s*<motion\.div\s*initial=\{\{ opacity: 0, y: 20 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}\s*className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100"\s*>\s*<div className="bg-indigo-600 p-8 text-center">\s*<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white\/20 mb-4 backdrop-blur-sm">\s*<Sparkles className="w-8 h-8 text-white" \/>\s*<\/div>\s*<h1 className="text-3xl font-bold text-white mb-2">Kids Quiz Maker<\/h1>\s*<p className="text-indigo-100 text-sm">Generate engaging YouTube-ready quizzes with AI<\/p>\s*<\/div>\s*\{loadedOfflineQuiz \? \(/;

const newRender = `return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100"
      >
        <div className="bg-indigo-600 p-8 text-center">
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
        </div>
        
        {setupMode === 'presentation' && !pendingInteractiveQuiz && !loadedOfflineQuiz ? (
          <form className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                Text Content (Max 5000 chars)
              </label>
              <textarea
                value={presentationContent}
                onChange={(e) => setPresentationContent(e.target.value.substring(0, 5000))}
                placeholder="Paste your text content here to generate a presentation..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-400 h-40 resize-none"
                required
              />
              <div className="text-xs text-right text-neutral-400">{presentationContent.length}/5000</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={presentationDuration}
                onChange={(e) => setPresentationDuration(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                type="button"
                onClick={(e) => handleGeneratePresentation(e as any, 'video')}
                disabled={loading || !presentationContent.trim()}
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
                    Video Mode
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => handleGeneratePresentation(e as any, 'interactive')}
                disabled={loading || !presentationContent.trim()}
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
                    Interactive
                  </>
                )}
              </button>
            </div>
          </form>
        ) : loadedOfflineQuiz ? (`;

const finalContent = content.replace(renderRegex, handleGeneratePresentation + newRender);
fs.writeFileSync('src/components/Setup.tsx', finalContent);
