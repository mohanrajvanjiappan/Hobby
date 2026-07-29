const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const targetStr = `      const getRandomBadge = (tier, playerName) => {
        const perfectOptions = [
          { name: 'Perfect Score', icon: '🏆', description: 'Answered everything correctly!' },
          { name: 'Flawless Victory', icon: '🌟', description: 'Didn\\'t miss a single one!' },
          { name: 'Absolute Genius', icon: '🤯', description: 'Mind-blowing performance!' }
        ];
        const whizOptions = [
          { name: \`\${topicWord} Whiz\`, icon: '🧠', description: \`Showed great knowledge of \${quiz.topic}!\` },
          { name: 'Smart Cookie', icon: '🍪', description: 'Very impressive answers!' },
          { name: 'Rising Star', icon: '✨', description: 'Shining bright with right answers!' }
        ];
        const learnerOptions = [
          { name: 'Fast Learner', icon: '🌱', description: 'Gained new knowledge today!' },
          { name: 'Brave Explorer', icon: '🗺️', description: 'Explored new topics!' },
          { name: 'Great Effort', icon: '👏', description: 'Never gave up!' }
        ];
        
        let pool = learnerOptions;
        if (tier === 'perfect') pool = perfectOptions;
        if (tier === 'whiz') pool = whizOptions;
        
        let available = pool.filter(b => !usedBadges.has(b.name));
        if (available.length === 0) available = pool;
        
        const chosen = available[Math.floor(Math.random() * available.length)];
        usedBadges.add(chosen.name);
        return { player: playerName, ...chosen };
      };`;

const replaceStr = `      const getRandomBadge = (tier, playerName) => {
        const perfectOptions = [
          { name: 'Perfect Score', icon: '🏆', description: 'Answered everything correctly!' },
          { name: 'Flawless Victory', icon: '🌟', description: 'Didn\\'t miss a single one!' },
          { name: 'Absolute Genius', icon: '🤯', description: 'Mind-blowing performance!' },
          { name: 'Trivia Titan', icon: '⚡', description: 'Unstoppable knowledge!' },
          { name: 'Quiz Conqueror', icon: '👑', description: 'Ruled the game flawlessly!' },
          { name: 'Mastermind', icon: '🔮', description: 'Saw every correct answer!' },
          { name: 'Legendary Status', icon: '🦄', description: 'A mythical perfect run!' },
          { name: 'Brain Boss', icon: '🎯', description: 'Hit the bullseye every time!' }
        ];
        const whizOptions = [
          { name: \`\${topicWord} Whiz\`, icon: '🧠', description: \`Showed great knowledge of \${quiz.topic}!\` },
          { name: 'Smart Cookie', icon: '🍪', description: 'Very impressive answers!' },
          { name: 'Rising Star', icon: '✨', description: 'Shining bright with right answers!' },
          { name: 'Knowledge Ninja', icon: '🥷', description: 'Swift and smart!' },
          { name: 'Sharp Shooter', icon: '🏹', description: 'Nailed most of the questions!' },
          { name: 'Quiz Wizard', icon: '🧙', description: 'Magical answering skills!' },
          { name: 'Brainiac', icon: '💡', description: 'Full of bright ideas!' },
          { name: 'Clever Fox', icon: '🦊', description: 'Outsmarted the tricky questions!' }
        ];
        const learnerOptions = [
          { name: 'Fast Learner', icon: '🌱', description: 'Gained new knowledge today!' },
          { name: 'Brave Explorer', icon: '🗺️', description: 'Explored new topics!' },
          { name: 'Great Effort', icon: '👏', description: 'Never gave up!' },
          { name: 'Curious Cat', icon: '🐱', description: 'Always eager to learn!' },
          { name: 'Future Expert', icon: '🚀', description: 'On the way to greatness!' },
          { name: 'Persistent Pupil', icon: '🐢', description: 'Slow and steady wins the race!' },
          { name: 'Knowledge Seeker', icon: '🔍', description: 'Discovered cool new facts!' },
          { name: 'Bright Spark', icon: '⚡', description: 'Showing great potential!' }
        ];
        
        let pool = learnerOptions;
        if (tier === 'perfect') pool = perfectOptions;
        if (tier === 'whiz') pool = whizOptions;
        
        let available = pool.filter(b => !usedBadges.has(b.name));
        if (available.length === 0) available = pool; // Fallback if we somehow use all of them
        
        const chosen = available[Math.floor(Math.random() * available.length)];
        usedBadges.add(chosen.name);
        return { player: playerName, ...chosen };
      };`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched getRandomBadge!");
