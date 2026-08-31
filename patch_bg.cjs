const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /  return \(\n    <div className=\{`\$\{quiz\.mode === 'interactive' \? 'presentation-interactive-cursor' : ''\} fixed inset-0 w-full h-full flex flex-col items-center overflow-hidden font-sans bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white selection:bg-white\/30`\}>/;

const replacement = `  let bgClasses = "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600";
  if (quiz.dynamicColors && quiz.mode === 'video') {
    const colorThemes = [
      "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600",
      "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600",
      "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600",
      "bg-gradient-to-br from-rose-400 via-red-500 to-pink-600",
      "bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-600"
    ];
    const themeIndex = Math.floor(currentQuestionIndex / 2) % colorThemes.length;
    bgClasses = colorThemes[themeIndex];
  }

  return (
    <div className={\`\${quiz.mode === 'interactive' ? 'presentation-interactive-cursor' : ''} fixed inset-0 w-full h-full flex flex-col items-center overflow-hidden font-sans \${bgClasses} text-white selection:bg-white/30 transition-colors duration-1000\`}>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Done");
