const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldOutro = `  const outroMessage = useMemo(() => {
    return OUTRO_MESSAGES[Math.floor(Math.random() * OUTRO_MESSAGES.length)];
  }, []);`;

const newOutro = `  const outroMessage = useMemo(() => {
    if (quiz.type === 'text-presentation') {
      return {
        title: "Thank You",
        subtitle: "Hope you enjoyed the presentation!",
        footer: "",
        speech: "Thank you for watching!"
      };
    }
    return OUTRO_MESSAGES[Math.floor(Math.random() * OUTRO_MESSAGES.length)];
  }, [quiz.type]);`;

content = content.replace(oldOutro, newOutro);
fs.writeFileSync('src/components/Presentation.tsx', content);
