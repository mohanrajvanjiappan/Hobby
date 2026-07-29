const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace(
  "type?: 'multiple-choice' | '5-clues' | 'detective' | 'find-in-map' | 'jumbled-letters' | 'match-the-following' | 'combat-mode' | 'word-search' | 'mega-quiz' | 'identify-image';",
  "type?: 'multiple-choice' | '5-clues' | 'detective' | 'find-in-map' | 'jumbled-letters' | 'match-the-following' | 'combat-mode' | 'word-search' | 'mega-quiz' | 'identify-image' | 'text-presentation';"
);
fs.writeFileSync('src/types.ts', content);
