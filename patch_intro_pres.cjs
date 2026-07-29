const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldIntro = `      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.6)] border-8 border-white mb-12"
            >
              <img src={quizLogo} alt="Quiz Time Brain Boosters" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight drop-shadow-2xl text-white">
              {quiz.type === 'combat-mode' ? 'Welcome back to Combat Mode!' : 'Welcome back to Quiz Time Brain Boosters'}
            </h1>
            <p className="text-3xl md:text-4xl opacity-100 font-bold text-cyan-100 drop-shadow-lg max-w-3xl leading-snug">
              {quiz.type === 'combat-mode' ? \`Today we are exploring: \${quiz.title || quiz.topic}. Pair up with a friend! Look at your side of the screen and answer before the time runs out!\` : \`Today we are exploring: \${quiz.title || quiz.topic}\`}
            </p>
          </motion.div>
        )}`;

const newIntro = `      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.6)] border-8 border-white mb-12"
            >
              <img src={(quiz.mode === 'interactive' && quiz.playerPhoto) ? quiz.playerPhoto : quizLogo} alt="Quiz Time Brain Boosters" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight drop-shadow-2xl text-white">
              {quiz.mode === 'interactive' 
                ? \`Welcome \${quiz.teamName}!\` 
                : (quiz.type === 'combat-mode' ? 'Welcome back to Combat Mode!' : 'Welcome back to Quiz Time Brain Boosters')}
            </h1>
            <p className="text-3xl md:text-4xl opacity-100 font-bold text-cyan-100 drop-shadow-lg max-w-3xl leading-snug">
              {quiz.mode === 'interactive' && quiz.playerDetails 
                ? quiz.playerDetails 
                : (quiz.type === 'combat-mode' ? \`Today we are exploring: \${quiz.title || quiz.topic}. Pair up with a friend! Look at your side of the screen and answer before the time runs out!\` : \`Today we are exploring: \${quiz.title || quiz.topic}\`)}
            </p>
          </motion.div>
        )}`;

content = content.replace(oldIntro, newIntro);

const oldImports = "import { Trophy, Star, Clock, Brain, Rocket, Sparkles, Lightbulb, Cat, Dumbbell, Bot, Computer, Dog, GraduationCap } from 'lucide-react';";
const newImports = "import { Trophy, Star, Clock, Brain, Rocket, Sparkles, Lightbulb, Cat, Dumbbell, Bot, Computer, Dog, GraduationCap, Play, Pause } from 'lucide-react';";
content = content.replace(oldImports, newImports);

fs.writeFileSync('src/components/Presentation.tsx', content);
