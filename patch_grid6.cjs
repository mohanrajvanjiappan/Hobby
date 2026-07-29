const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const targetStage = `{stage === 'question-selection' && (`;

const replaceStage = `        {stage === 'category-selection' && (
          <motion.div
            key="category-selection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center h-full p-8 z-10 w-full"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-12 text-white drop-shadow-2xl">
              {quiz.isMultiplayer ? \`\${playersState[currentPlayerIndex]?.name}, choose a category!\` : 'Choose a Category!'}
            </h2>
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl w-full mx-auto">
              {categories.map((cat, i) => {
                const catQuestions = quiz.questions.map((q, idx) => ({ q, idx })).filter(x => x.q.category === cat);
                const allAnswered = catQuestions.every(x => answeredQuestions.has(x.idx));
                const answeredCount = catQuestions.filter(x => answeredQuestions.has(x.idx)).length;
                return (
                  <button
                    key={cat}
                    disabled={allAnswered}
                    onClick={() => {
                      audioSynth.playSwoosh();
                      setSelectedCategory(cat);
                      setStage('question-selection');
                    }}
                    className={\`px-8 py-6 rounded-3xl text-3xl font-black transition-all flex flex-col items-center gap-2 shadow-xl \${
                      allAnswered
                        ? 'bg-slate-500/40 text-slate-300/40 cursor-not-allowed border-4 border-slate-400/30 shadow-inner'
                        : 'bg-white text-indigo-700 hover:scale-105 active:translate-y-2'
                    }\`}
                  >
                    <span>{cat}</span>
                    <span className={\`text-lg font-bold \${allAnswered ? 'text-slate-400/50' : 'text-indigo-400'}\`}>
                      {answeredCount} / {catQuestions.length} Answered
                    </span>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => {
                audioSynth.playSwoosh();
                setStage('score');
              }}
              className="mt-16 px-8 py-4 bg-rose-500 text-white font-bold text-xl rounded-full shadow-lg hover:bg-rose-600 transition-colors"
            >
              End Quiz
            </button>
          </motion.div>
        )}
        
        {stage === 'question-selection' && (`;

content = content.replace(targetStage, replaceStage);

const targetGridMap = `{quiz.questions.map((q, idx) => {
                const isAnswered = answeredQuestions.has(idx);`;
                
const replaceGridMap = `{quiz.questions.map((q, idx) => {
                if (categories.length > 1 && selectedCategory && q.category !== selectedCategory) return null;
                const isAnswered = answeredQuestions.has(idx);`;

content = content.replace(targetGridMap, replaceGridMap);

const targetGridHeader = `<h2 className="text-4xl md:text-5xl font-bold mb-12 text-white drop-shadow-xl">
              {playersState[currentPlayerIndex]?.name}, select a question!
            </h2>`;

const replaceGridHeader = `<div className="flex flex-col items-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl text-center">
                {quiz.isMultiplayer ? \`\${playersState[currentPlayerIndex]?.name}, select a question!\` : 'Select a question!'}
              </h2>
              {categories.length > 1 && selectedCategory && (
                <div className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white font-bold text-2xl flex items-center gap-3">
                  <span className="opacity-80">Category:</span> {selectedCategory}
                </div>
              )}
            </div>`;

content = content.replace(targetGridHeader, replaceGridHeader);

const targetEndQuiz = `End Quiz
            </button>
          </motion.div>`;
          
const replaceEndQuiz = `End Quiz
            </button>
            {categories.length > 1 && (
              <button
                onClick={() => {
                  audioSynth.playSwoosh();
                  setStage('category-selection');
                }}
                className="mt-4 px-8 py-4 bg-indigo-500/80 text-white font-bold text-xl rounded-full shadow-lg hover:bg-indigo-600 transition-colors backdrop-blur-sm border border-white/20"
              >
                Change Category
              </button>
            )}
          </motion.div>`;
          
content = content.replace(targetEndQuiz, replaceEndQuiz);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched category selection UI!");
