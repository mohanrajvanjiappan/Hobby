const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Fix question grid
content = content.replace(
  "{playersState.length - idx}\n                  </button>",
  "{idx + 1}\n                  </button>"
);

// Update rank number correctly
content = content.replace(
  "text-yellow-500' : 'bg-white/30 text-white'}>\n                        {idx + 1}",
  "text-yellow-500' : 'bg-white/30 text-white'}>\n                        {playersState.length - idx}"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
