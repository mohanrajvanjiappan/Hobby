const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const replacement = "const emojis = (quiz.themeMemoryBreak && quiz.memoryBreakEmojis && quiz.memoryBreakEmojis.length >= 10) ? quiz.memoryBreakEmojis : ['🍎','🚗','🐶','🚀','🎸','🏀','🍔','🚲','📚','⌚','🧸','🌻','🎈','📷','🧩','🍉','🛸','🐱','🎷','🏈','🍓','🍦','🍩','🐧','🦋','🐢','🦖','🐙','🐳','🐬','🦄','🌈','☀️','🌙','⭐','🎨','🎮','🎲','🎯','🏆','🏅','🎭','🎪','🎢','🎡','🚁','✈️','⛵','🚂','🚜','🚒','🚓','🚑','🚕','🚌','🏰','⛺','🏠','🌲','🌴','🌵','🍁','🍄','🍇','🍌','🍒','🍑','🍍','🥑','🥕','🌽','🥦','🥨','🧀','🥩','🍗','🌮','🌯','🥗','🍿','🍫','🍬','🍭','🍼','☕','🍵','🥤','🍹','🧊','⚽','⚾','🥎','🎾','🏐','🏉','🎱','🪀','🪁','🔮','🪄','🧿','💎','👑','🔔','🎵','🎶'];";

const replacementAllEmoji = "const allEmoji = (quiz.themeMemoryBreak && quiz.memoryBreakEmojis && quiz.memoryBreakEmojis.length >= 10) ? quiz.memoryBreakEmojis : ['🍎','🚗','🐶','🚀','🎸','🏀','🍔','🚲','📚','⌚','🧸','🌻','🎈','📷','🧩','🍉','🛸','🐱','🎷','🏈','🍓','🍦','🍩','🐧','🦋','🐢','🦖','🐙','🐳','🐬','🦄','🌈','☀️','🌙','⭐','🎨','🎮','🎲','🎯','🏆','🏅','🎭','🎪','🎢','🎡','🚁','✈️','⛵','🚂','🚜','🚒','🚓','🚑','🚕','🚌','🏰','⛺','🏠','🌲','🌴','🌵','🍁','🍄','🍇','🍌','🍒','🍑','🍍','🥑','🥕','🌽','🥦','🥨','🧀','🥩','🍗','🌮','🌯','🥗','🍿','🍫','🍬','🍭','🍼','☕','🍵','🥤','🍹','🧊','⚽','⚾','🥎','🎾','🏐','🏉','🎱','🪀','🪁','🔮','🪄','🧿','💎','👑','🔔','🎵','🎶'];";

code = code.replace(/const emojis = \['🍎'.*?\];/g, replacement);
code = code.replace(/const allEmoji = \['🍎'.*?\];/g, replacementAllEmoji);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done Presentation patch");
