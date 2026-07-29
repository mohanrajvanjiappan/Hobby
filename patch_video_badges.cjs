const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const effectTarget = `    if (stage === 'video-badges') {
      audioSynth.playHTML5Badge();
      audioSynth.playSwoosh();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const numAnswered = currentQuestionIndex + 1;
      audioSynth.speak(\`Wow, you've reached \${numAnswered} questions! Here is a badge for your great effort! Keep it up!\`, () => {
        setTimeout(() => {
           setCurrentQuestionIndex((prev) => prev + 1);
           setStage('question');
        }, 3000);
      });
      return () => window.speechSynthesis.cancel();
    }`;
    
const effectReplace = `    if (stage === 'video-badges') {
      audioSynth.playHTML5Badge();
      audioSynth.playSwoosh();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const numAnswered = (quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode') 
        ? answeredQuestions.size 
        : currentQuestionIndex + 1;
        
      const badgeIndex = Math.floor(numAnswered / 5) - 1;
      const milestoneBadges = [
        { title: "Bronze Scholar", icon: "🥉", description: "Great start, keep it up!" },
        { title: "Silver Thinker", icon: "🥈", description: "You're on a roll!" },
        { title: "Gold Mastermind", icon: "🥇", description: "Halfway to genius!" },
        { title: "Diamond Genius", icon: "💎", description: "Incredible knowledge!" },
        { title: "Legendary Expert", icon: "👑", description: "Unstoppable force!" }
      ];
      const currentBadge = milestoneBadges[Math.min(Math.max(0, badgeIndex), milestoneBadges.length - 1)];
      
      const speechMsg = quiz.mode === 'interactive' 
        ? \`Milestone reached! You've unlocked the \${currentBadge.title} badge for reaching \${numAnswered} questions!\` 
        : \`Wow, you've reached \${numAnswered} questions! Here is a badge for your great effort! Keep it up!\`;

      audioSynth.speak(speechMsg, () => {
        setTimeout(() => {
           if (quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode') {
             setStage('question-selection');
           } else {
             setCurrentQuestionIndex((prev) => prev + 1);
             setStage('question');
           }
        }, 3000);
      });
      return () => window.speechSynthesis.cancel();
    }`;

content = content.replace(effectTarget, effectReplace);

const uiTarget = `        {stage === 'video-badges' && (
          <motion.div
            key="video-badges"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
             <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-12">
               Audience Milestone!
             </h1>
             <motion.div
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="bg-white rounded-3xl p-12 flex flex-col items-center text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-b-[16px] border-amber-400 w-full max-w-md"
              >
                <div className="text-8xl md:text-9xl mb-8 filter drop-shadow-lg animate-bounce">🌟</div>
                <h3 className="text-3xl md:text-5xl font-black text-amber-600 mb-4">{currentQuestionIndex + 1} Questions!</h3>
                <p className="text-xl md:text-2xl text-slate-600 font-bold">Great job following along!</p>
              </motion.div>
          </motion.div>
        )}`;
        
const uiReplace = `        {stage === 'video-badges' && (() => {
          const numAnswered = (quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode')
            ? answeredQuestions.size 
            : currentQuestionIndex + 1;
            
          const badgeIndex = Math.floor(numAnswered / 5) - 1;
          const milestoneBadges = [
            { title: "Bronze Scholar", icon: "🥉", description: "Great start, keep it up!", color: "border-amber-700", text: "text-amber-800" },
            { title: "Silver Thinker", icon: "🥈", description: "You're on a roll!", color: "border-slate-300", text: "text-slate-500" },
            { title: "Gold Mastermind", icon: "🥇", description: "Halfway to genius!", color: "border-yellow-400", text: "text-yellow-600" },
            { title: "Diamond Genius", icon: "💎", description: "Incredible knowledge!", color: "border-cyan-300", text: "text-cyan-500" },
            { title: "Legendary Expert", icon: "👑", description: "Unstoppable force!", color: "border-fuchsia-400", text: "text-fuchsia-600" }
          ];
          const currentBadge = milestoneBadges[Math.min(Math.max(0, badgeIndex), milestoneBadges.length - 1)];
          
          return (
          <motion.div
            key="video-badges"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
             <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-12">
               {quiz.mode === 'interactive' ? 'Milestone Reached!' : 'Audience Milestone!'}
             </h1>
             <motion.div
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className={\`bg-white rounded-3xl p-12 flex flex-col items-center text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-b-[16px] \${currentBadge.color} w-full max-w-md\`}
              >
                <div className="text-8xl md:text-9xl mb-8 filter drop-shadow-lg animate-bounce">{currentBadge.icon}</div>
                <h3 className={\`text-3xl md:text-5xl font-black \${currentBadge.text} mb-4\`}>{currentBadge.title}</h3>
                <p className="text-xl md:text-2xl text-slate-600 font-bold">{currentBadge.description}</p>
                <div className="mt-6 py-2 px-6 bg-slate-100 rounded-full font-bold text-slate-500">
                  {numAnswered} Questions Completed!
                </div>
              </motion.div>
          </motion.div>
        );
        })()}`;

content = content.replace(effectTarget, effectReplace);
content = content.replace(uiTarget, uiReplace);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched video-badges effect and UI!");
