const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const largeEmojiArray = "['🍎','🚗','🐶','🚀','🎸','🏀','🍔','🚲','📚','⌚','🧸','🌻','🎈','📷','🧩','🍉','🛸','🐱','🎷','🏈','🍓','🍦','🍩','🐧','🦋','🐢','🦖','🐙','🐳','🐬','🦄','🌈','☀️','🌙','⭐','🎨','🎮','🎲','🎯','🏆','🏅','🎭','🎪','🎢','🎡','🚁','✈️','⛵','🚂','🚜','🚒','🚓','🚑','🚕','🚌','🏰','⛺','🏠','🌲','🌴','🌵','🍁','🍄','🍇','🍌','🍒','🍑','🍍','🥑','🥕','🌽','🥦','🥨','🧀','🥩','🍗','🌮','🌯','🥗','🍿','🍫','🍬','🍭','🍼','☕','🍵','🥤','🍹','🧊','⚽','⚾','🥎','🎾','🏐','🏉','🎱','🪀','🪁','🔮','🪄','🧿','💎','👑','🔔','🎵','🎶']";

code = code.replace(/const emojis = \['🍎'.*?\];/g, "const emojis = " + largeEmojiArray + ";");
code = code.replace(/const allEmoji = \['🍎'.*?\];/g, "const allEmoji = " + largeEmojiArray + ";");

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done");
