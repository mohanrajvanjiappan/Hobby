const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Change sort from b.score - a.score (high to low) to a.score - b.score (low to high)
// Also change the crown to appear on the last item (highest score)
content = content.replace(
  /{...playersState}\.sort\(\(a, b\) => b\.score - a\.score\)\.map\(\(player, idx\) => \(/,
  "{...playersState}.sort((a, b) => a.score - b.score).map((player, idx) => ("
);

// We need to update the logic that identifies the winner (idx === playersState.length - 1) instead of idx === 0
content = content.replace(
  /idx === 0 \? 'bg-yellow-400 text-yellow-900 shadow-\[0_0_40px_rgba\(250,204,21,0\.6\)\] scale-105 border-4 border-white' : 'bg-white\\/20 text-white backdrop-blur-sm border-2 border-white\\/30'/g,
  "idx === playersState.length - 1 ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_40px_rgba(250,204,21,0.6)] scale-105 border-4 border-white z-10' : 'bg-white/20 text-white backdrop-blur-sm border-2 border-white/30'"
);

content = content.replace(
  /idx === 0 \? 'bg-white text-yellow-500' : 'bg-white\\/30 text-white'/g,
  "idx === playersState.length - 1 ? 'bg-white text-yellow-500' : 'bg-white/30 text-white'"
);

content = content.replace(
  /idx === 0 && <span className="text-5xl">👑<\\/span>/g,
  "idx === playersState.length - 1 && <span className=\"text-5xl\">👑</span>"
);

// Rank number should be playersState.length - idx
content = content.replace(
  /\{idx \+ 1\}/,
  "{playersState.length - idx}"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
