const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const regex = /if \(mode === 'interactive'\) \{\s*setPendingInteractiveQuiz\(\{\s*mode: 'interactive',\s*title: "Animated Presentation",\s*topic: "Presentation",\s*theme: \{\s*primaryColor: "#4F46E5",\s*secondaryColor: "#10B981",\s*textColor: "#ffffff"\s*\},\s*questions: \[\],\s*quotes: \[\],\s*type: 'text-presentation',\s*isOfflineMode: false,\s*\} as any\);\s*return;\s*\}/g;

content = content.replace(regex, "");

// find onQuizGenerated({ ...data, mode });
const replacer = `onQuizGenerated({ ...data, mode });`;
const newReplacer = `if (mode === 'interactive') { setPendingInteractiveQuiz({ ...data, mode }); } else { onQuizGenerated({ ...data, mode }); }`;
content = content.replace(replacer, newReplacer);

fs.writeFileSync('src/components/Setup.tsx', content);
