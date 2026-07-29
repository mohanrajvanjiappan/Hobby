const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const badgesTarget = `      if (quiz.isMultiplayer) {
        playersState.forEach(p => {
          if (p.score === quiz.questions.length * scorePerQuestion && quiz.questions.length > 0) {
            generatedBadges.push({ player: p.name, name: 'Perfect Score', icon: '🏆', description: 'Answered everything correctly!' });
          } else if (p.score >= (quiz.questions.length / 2) * scorePerQuestion && quiz.questions.length > 0) {

            generatedBadges.push({ player: p.name, name: \`\${topicWord} Whiz\`, icon: '🧠', description: \`Showed great knowledge of \${quiz.topic}!\` });
          } else {
             generatedBadges.push({ player: p.name, name: 'Fast Learner', icon: '🌱', description: 'Gained new knowledge today!' });
          }
        });
        
        const sorted = [...playersState].sort((a,b) => b.score - a.score);
        if (sorted[0] && sorted[0].score > 0) {
           generatedBadges.push({ player: sorted[0].name, name: 'Quiz Master', icon: '👑', description: 'Achieved the highest score!' });
        }
      } else {
        const pName = quiz.teamName || 'Player 1';
        if (score === quiz.questions.length * scorePerQuestion && quiz.questions.length > 0) {
          generatedBadges.push({ player: pName, name: 'Perfect Score', icon: '🏆', description: 'Answered everything correctly!' });
        } else if (score >= (quiz.questions.length / 2) * scorePerQuestion && quiz.questions.length > 0) {
          generatedBadges.push({ player: pName, name: \`\${topicWord} Whiz\`, icon: '🧠', description: \`Showed great knowledge of \${quiz.topic}!\` });
        } else {
          generatedBadges.push({ player: pName, name: 'Fast Learner', icon: '🌱', description: 'Gained new knowledge today!' });
        }
        generatedBadges.push({ player: pName, name: 'Fast Thinker', icon: '⚡', description: 'Answered questions with speed!' });
      }`;

const badgesReplace = `      const usedBadges = new Set();
      
      const getRandomBadge = (tier, playerName) => {
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
      };

      if (quiz.isMultiplayer) {
        const sorted = [...playersState].sort((a,b) => b.score - a.score);
        sorted.forEach((p, index) => {
          if (p.score === quiz.questions.length * scorePerQuestion && quiz.questions.length > 0) {
            generatedBadges.push(getRandomBadge('perfect', p.name));
          } else if (p.score >= (quiz.questions.length / 2) * scorePerQuestion && quiz.questions.length > 0) {
            generatedBadges.push(getRandomBadge('whiz', p.name));
          } else {
            generatedBadges.push(getRandomBadge('learner', p.name));
          }
        });
        
        if (sorted[0] && sorted[0].score > 0) {
           generatedBadges.unshift({ player: sorted[0].name, name: 'Quiz Master', icon: '👑', description: 'Achieved the highest score!' });
        }
      } else {
        const pName = quiz.teamName || 'Player 1';
        if (score === quiz.questions.length * scorePerQuestion && quiz.questions.length > 0) {
          generatedBadges.push(getRandomBadge('perfect', pName));
        } else if (score >= (quiz.questions.length / 2) * scorePerQuestion && quiz.questions.length > 0) {
          generatedBadges.push(getRandomBadge('whiz', pName));
        } else {
          generatedBadges.push(getRandomBadge('learner', pName));
        }
        generatedBadges.push({ player: pName, name: 'Fast Thinker', icon: '⚡', description: 'Answered questions with speed!' });
      }`;

content = content.replace(badgesTarget, badgesReplace);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched end badges logic!");
