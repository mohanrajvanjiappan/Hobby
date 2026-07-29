const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const target1 = `generatedBadges.unshift({ player: sorted[0].name, name: 'Quiz Master', icon: '👑', description: 'Achieved the highest score!' });`;
const replace1 = `const winnerOptions = [
            { name: 'Quiz Master', icon: '👑', description: 'Achieved the highest score!' },
            { name: 'Grand Champion', icon: '🏆', description: 'Outscored everyone else!' },
            { name: 'Supreme Victor', icon: '⭐', description: 'The undisputed winner!' },
            { name: 'Top Dog', icon: '🥇', description: 'Finished in first place!' },
            { name: 'Quiz Legend', icon: '🌟', description: 'A legendary performance!' }
          ];
          generatedBadges.unshift({ player: sorted[0].name, ...winnerOptions[Math.floor(Math.random() * winnerOptions.length)] });`;

content = content.replace(target1, replace1);

const target2 = `generatedBadges.push({ player: pName, name: 'Fast Thinker', icon: '⚡', description: 'Answered questions with speed!' });`;
const replace2 = `const fastOptions = [
          { name: 'Fast Thinker', icon: '⚡', description: 'Answered questions with speed!' },
          { name: 'Speed Demon', icon: '🏎️', description: 'Incredibly quick responses!' },
          { name: 'Lightning Fast', icon: '🌩️', description: 'Blink and you miss it!' },
          { name: 'Quick Wits', icon: '🧠', description: 'Sharp and speedy!' },
          { name: 'Rapid Fire', icon: '🔥', description: 'Blazing fast answers!' }
        ];
        generatedBadges.push({ player: pName, ...fastOptions[Math.floor(Math.random() * fastOptions.length)] });`;

content = content.replace(target2, replace2);

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched fixed badges!");
