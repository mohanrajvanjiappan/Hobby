const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Replace Intro Speech
const speechRegex = /let introSpeech = \`Welcome back to Quiz Time Brain Boosters[\s\S]*?Find the 5 hidden words in the grid[^`]*\`;\s*\}/;

const newSpeech = `let introSpeech = \`Welcome back to Quiz Time Brain Boosters. Today we are exploring \${quiz.title || quiz.topic}.\`;
          if (quiz.isMultiplayer && playersState.length > 1) {
            const playerNames = playersState.map(p => p.name).join(' and ');
            introSpeech = \`Welcome back to Quiz Time Brain Boosters. Today's battle is between \${playerNames}. The topic is \${quiz.title || quiz.topic}.\`;
          } else if (quiz.teamName && quiz.mode === 'interactive') {
            introSpeech = \`Welcome back to Quiz Time Brain Boosters, \${quiz.teamName}. Today we are exploring \${quiz.title || quiz.topic}.\`;
          }

          if (quiz.type === 'combat-mode') {
            introSpeech = \`Welcome back to Combat Mode! Today's topic is \${quiz.title || quiz.topic}. Pair up with a friend. Look at your side of the screen and answer before the time runs out!\`;
          } else if (quiz.type === 'word-search') {
            introSpeech = \`Welcome back to Word Search! Today's topic is \${quiz.title || quiz.topic}. Find the 5 hidden words in the grid. You have 30 seconds. Look left-to-right, and top-to-bottom only!\`;
          }`;

content = content.replace(speechRegex, newSpeech);

// Replace JSX
const jsxRegex = /<h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight drop-shadow-2xl text-white">[\s\S]*?<\/p>/;

const newJsx = `<h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight drop-shadow-2xl text-white">
              {quiz.isMultiplayer && playersState.length > 1
                ? \`Battle: \${playersState.map(p => p.name).join(' vs ')}\`
                : (quiz.mode === 'interactive' 
                  ? \`Welcome \${quiz.teamName}!\` 
                  : (quiz.type === 'combat-mode' ? 'Welcome back to Combat Mode!' : 'Welcome back to Quiz Time Brain Boosters'))}
            </h1>
            <p className="text-3xl md:text-4xl opacity-100 font-bold text-cyan-100 drop-shadow-lg max-w-3xl leading-snug">
              {quiz.isMultiplayer && playersState.length > 1
                ? \`Today's topic: \${quiz.title || quiz.topic}\`
                : (quiz.mode === 'interactive' && quiz.playerDetails 
                  ? quiz.playerDetails 
                  : (quiz.type === 'combat-mode' ? \`Today we are exploring: \${quiz.title || quiz.topic}. Pair up with a friend! Look at your side of the screen and answer before the time runs out!\` : \`Today we are exploring: \${quiz.title || quiz.topic}\`))}
            </p>`;

content = content.replace(jsxRegex, newJsx);

fs.writeFileSync('src/components/Presentation.tsx', content);
