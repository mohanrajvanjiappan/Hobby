const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf-8');

// Add state
code = code.replace(
  "const [presentationDuration, setPresentationDuration] = useState(5);",
  "const [presentationDuration, setPresentationDuration] = useState(5);\n  const [previewQuizData, setPreviewQuizData] = useState<{quiz: Quiz, mode: 'video'|'interactive'}|null>(null);"
);

// Update handleGenerate to intercept
const generateInterceptTarget = `      if (mode === 'interactive') {
        setPendingInteractiveQuiz(data);
      } else {
        setLoadedOfflineQuiz(data);
      }`;
      
const generateInterceptReplace = `      if (enableInsightImages && data.questions?.some((q: any) => q.insightImageUrl)) {
        setPreviewQuizData({ quiz: data, mode });
      } else {
        if (mode === 'interactive') {
          setPendingInteractiveQuiz(data);
        } else {
          setLoadedOfflineQuiz(data);
        }
      }`;
code = code.replace(generateInterceptTarget, generateInterceptReplace);

// Update enrichQuizInsightsAndStart to intercept
const enrichInterceptTarget = `      const finalQuiz = { ...quizToEnrich, mode, showBadges, enableMemoryBreak, themeMemoryBreak, enableInsightImages, dynamicColors: enableDynamicColors, rules: rules || undefined };
      if (mode === 'interactive') {
        setPendingInteractiveQuiz(finalQuiz);
      } else {
        onQuizGenerated(finalQuiz);
      }`;

const enrichInterceptReplace = `      const finalQuiz = { ...quizToEnrich, mode, showBadges, enableMemoryBreak, themeMemoryBreak, enableInsightImages, dynamicColors: enableDynamicColors, rules: rules || undefined };
      if (enableInsightImages && finalQuiz.questions?.some(q => q.insightImageUrl)) {
        setPreviewQuizData({ quiz: finalQuiz, mode });
      } else {
        if (mode === 'interactive') {
          setPendingInteractiveQuiz(finalQuiz);
        } else {
          onQuizGenerated(finalQuiz);
        }
      }`;
code = code.replace(enrichInterceptTarget, enrichInterceptReplace);

// Add preview UI to return statement
const renderTarget = `return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto pt-8 md:pt-12 pb-24 px-4 relative z-10">
        
        {/* Header Options */}`;

const renderReplace = `return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto pt-8 md:pt-12 pb-24 px-4 relative z-10">
        
        {previewQuizData ? (
          <div className="p-8 space-y-6 max-w-5xl mx-auto bg-white rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold text-slate-800 text-center">Preview Insight Images</h2>
            <p className="text-slate-600 text-center">Select or unselect the insight images generated for this quiz before starting.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {previewQuizData.quiz.questions.map((q, idx) => {
                if (!q.insightImageUrl) return null;
                return (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border-4 transition-all hover:shadow-lg" style={{ borderColor: q.insightImageUrl ? '#10b981' : '#cbd5e1' }}>
                    <img src={q.insightImageUrl} alt="Insight" className="w-full h-48 object-cover opacity-100" style={{ opacity: q.insightImageUrl ? 1 : 0.5 }} crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 cursor-pointer" onClick={() => {
                      const newQuiz = { ...previewQuizData.quiz };
                      // We toggle by storing original url in a temp property if unselected
                      if (q.insightImageUrl) {
                        q._tempInsightUrl = q.insightImageUrl;
                        q.insightImageUrl = undefined;
                      } else if (q._tempInsightUrl) {
                        q.insightImageUrl = q._tempInsightUrl;
                      }
                      setPreviewQuizData({ ...previewQuizData, quiz: newQuiz });
                    }}>
                      <input type="checkbox" checked={!!q.insightImageUrl} readOnly className="w-6 h-6 text-emerald-600 rounded cursor-pointer pointer-events-none" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 backdrop-blur-sm">
                      <p className="text-white text-sm font-bold truncate">Q{idx + 1}: {q.correctAnswer || q.answer || q.question}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => setPreviewQuizData(null)}
                className="flex-1 py-4 rounded-xl bg-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const mode = previewQuizData.mode;
                  const finalQuiz = previewQuizData.quiz;
                  if (mode === 'interactive') {
                    setPendingInteractiveQuiz(finalQuiz);
                  } else {
                    onQuizGenerated(finalQuiz);
                  }
                  setPreviewQuizData(null);
                }}
                className="flex-2 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                Continue <Play className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
        ) : loadedOfflineQuiz ? (`;

code = code.replace(`return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto pt-8 md:pt-12 pb-24 px-4 relative z-10">
        
        {/* Header Options */}`, renderReplace);

fs.writeFileSync('src/components/Setup.tsx', code);
