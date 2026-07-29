const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldTitle = `              <div className="bg-indigo-700 text-white px-8 py-3 rounded-full shadow-2xl font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-indigo-400">
                <Star className="w-6 h-6 text-yellow-300 fill-current" />
                <span>{quiz.title}</span>
                <Star className="w-6 h-6 text-yellow-300 fill-current" />
              </div>`;

const newTitle = `              <div className="bg-indigo-700 text-white px-8 py-3 rounded-full shadow-2xl font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-indigo-400">
                <Star className="w-6 h-6 text-yellow-300 fill-current" />
                <span>{quiz.mode === 'interactive' && quiz.teamName ? \`\${quiz.teamName} | \${quiz.title}\` : quiz.title}</span>
                <Star className="w-6 h-6 text-yellow-300 fill-current" />
              </div>`;

content = content.replace(oldTitle, newTitle);

const oldTypeBox = `                  {quiz.isOfflineMode && (
                    <div className="absolute top-6 left-6 md:left-10 bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full font-bold uppercase tracking-widest text-sm md:text-base shadow-sm border-2 border-indigo-200">
                      {(question.type || quiz.type || 'Quiz').replace(/-/g, ' ')}
                    </div>
                  )}`;

const newTypeBox = ``;

content = content.replace(oldTypeBox, newTypeBox);

fs.writeFileSync('src/components/Presentation.tsx', content);
