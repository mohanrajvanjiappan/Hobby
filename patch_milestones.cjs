const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// There are two places where milestoneBadges is defined (one for audioSynth.speak, one for rendering).
// I should extract it or just replace both.
// Let's replace the first one (for speech):

const targetAudio = `      const milestoneBadges = [
        { title: "Bronze Scholar", icon: "🥉", description: "Great start, keep it up!", color: "border-amber-700", text: "text-amber-800" },
        { title: "Silver Thinker", icon: "🥈", description: "You're on a roll!", color: "border-slate-300", text: "text-slate-500" },
        { title: "Gold Mastermind", icon: "🥇", description: "Halfway to genius!", color: "border-yellow-400", text: "text-yellow-600" },
        { title: "Diamond Genius", icon: "💎", description: "Incredible knowledge!", color: "border-cyan-300", text: "text-cyan-500" },
        { title: "Legendary Expert", icon: "👑", description: "Unstoppable force!", color: "border-fuchsia-400", text: "text-fuchsia-600" }
      ];
      const currentBadge = milestoneBadges[Math.min(Math.max(0, badgeIndex), milestoneBadges.length - 1)];`;

const replaceAudio = `      const milestoneTiers = [
        [
          { title: "Bronze Scholar", icon: "🥉", description: "Great start, keep it up!", color: "border-amber-700", text: "text-amber-800" },
          { title: "Bronze Explorer", icon: "🥉", description: "Making good progress!", color: "border-amber-700", text: "text-amber-800" },
          { title: "Bronze Rookie", icon: "🥉", description: "A solid beginning!", color: "border-amber-700", text: "text-amber-800" }
        ],
        [
          { title: "Silver Thinker", icon: "🥈", description: "You're on a roll!", color: "border-slate-300", text: "text-slate-500" },
          { title: "Silver Brainiac", icon: "🥈", description: "Impressive streak!", color: "border-slate-300", text: "text-slate-500" },
          { title: "Silver Achiever", icon: "🥈", description: "Moving up the ranks!", color: "border-slate-300", text: "text-slate-500" }
        ],
        [
          { title: "Gold Mastermind", icon: "🥇", description: "Halfway to genius!", color: "border-yellow-400", text: "text-yellow-600" },
          { title: "Gold Champion", icon: "🥇", description: "Shining bright!", color: "border-yellow-400", text: "text-yellow-600" },
          { title: "Gold Virtuoso", icon: "🥇", description: "Exceptional skills!", color: "border-yellow-400", text: "text-yellow-600" }
        ],
        [
          { title: "Diamond Genius", icon: "💎", description: "Incredible knowledge!", color: "border-cyan-300", text: "text-cyan-500" },
          { title: "Diamond Elite", icon: "💎", description: "Top tier performance!", color: "border-cyan-300", text: "text-cyan-500" },
          { title: "Diamond Star", icon: "💎", description: "Flawless execution!", color: "border-cyan-300", text: "text-cyan-500" }
        ],
        [
          { title: "Legendary Expert", icon: "👑", description: "Unstoppable force!", color: "border-fuchsia-400", text: "text-fuchsia-600" },
          { title: "Legendary Titan", icon: "👑", description: "Absolute mastery!", color: "border-fuchsia-400", text: "text-fuchsia-600" },
          { title: "Mythic Hero", icon: "👑", description: "Beyond comparison!", color: "border-fuchsia-400", text: "text-fuchsia-600" }
        ]
      ];
      
      const safeBadgeIndex = Math.min(Math.max(0, badgeIndex), milestoneTiers.length - 1);
      // Use a stable seed based on badge index and quiz length
      const seed = safeBadgeIndex + (quiz.questions.length * 3);
      const tierOptions = milestoneTiers[safeBadgeIndex];
      const currentBadge = tierOptions[seed % tierOptions.length];`;

content = content.replace(targetAudio, replaceAudio);

const targetRender = `          const milestoneBadges = [
            { title: "Bronze Scholar", icon: "🥉", description: "Great start, keep it up!", color: "border-amber-700", text: "text-amber-800" },
            { title: "Silver Thinker", icon: "🥈", description: "You're on a roll!", color: "border-slate-300", text: "text-slate-500" },
            { title: "Gold Mastermind", icon: "🥇", description: "Halfway to genius!", color: "border-yellow-400", text: "text-yellow-600" },
            { title: "Diamond Genius", icon: "💎", description: "Incredible knowledge!", color: "border-cyan-300", text: "text-cyan-500" },
            { title: "Legendary Expert", icon: "👑", description: "Unstoppable force!", color: "border-fuchsia-400", text: "text-fuchsia-600" }
          ];
          const currentBadge = milestoneBadges[Math.min(Math.max(0, badgeIndex), milestoneBadges.length - 1)];`;

content = content.replace(targetRender, replaceAudio); // Reuse the same logic for render

fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched milestone badges!");
