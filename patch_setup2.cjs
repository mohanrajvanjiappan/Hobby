const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf-8');

const targetMap = `{previewQuizData.quiz.questions.map((q, idx) => {
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
              })}`;

const replaceMap = `{previewQuizData.quiz.questions.map((q: any, idx: number) => {
                const hasImage = !!q.insightImageUrl;
                const tempUrl = q._tempInsightUrl;
                if (!hasImage && !tempUrl) return null;
                const currentUrl = hasImage ? q.insightImageUrl : tempUrl;
                return (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border-4 transition-all hover:shadow-lg" style={{ borderColor: hasImage ? '#10b981' : '#cbd5e1' }}>
                    <img src={currentUrl} alt="Insight" className="w-full h-48 object-cover opacity-100" style={{ opacity: hasImage ? 1 : 0.5, filter: hasImage ? 'none' : 'grayscale(100%)' }} crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 cursor-pointer" onClick={() => {
                      const newQuiz = { ...previewQuizData.quiz };
                      if (hasImage) {
                        newQuiz.questions[idx]._tempInsightUrl = newQuiz.questions[idx].insightImageUrl;
                        newQuiz.questions[idx].insightImageUrl = undefined;
                      } else {
                        newQuiz.questions[idx].insightImageUrl = tempUrl;
                      }
                      setPreviewQuizData({ ...previewQuizData, quiz: newQuiz });
                    }}>
                      <input type="checkbox" checked={hasImage} readOnly className="w-6 h-6 text-emerald-600 rounded cursor-pointer pointer-events-none" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 backdrop-blur-sm">
                      <p className="text-white text-sm font-bold truncate">Q{idx + 1}: {q.correctAnswer || q.answer || q.question}</p>
                    </div>
                  </div>
                );
              })}`;

code = code.replace(targetMap, replaceMap);

// Also fix `flex-2` which is not a valid tailwind class. Let's use flex-1
code = code.replace(`className="flex-2 py-4 rounded-xl`, `className="flex-1 py-4 rounded-xl`);

fs.writeFileSync('src/components/Setup.tsx', code);
