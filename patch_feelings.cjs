const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

content = content.replace(
  "const [warmupFeeling, setWarmupFeeling] = useState<string | null>(null);",
  "const [warmupFeeling, setWarmupFeeling] = useState<string | null>(null);\n  const [warmupOptions] = useState<string[]>(() => {\n    const feelings = ['Curious', 'Scared', 'Excited', 'Happy', 'Bored', 'Nervous', 'Silly', 'Sleepy', 'Confused', 'Energetic', 'Proud', 'Calm', 'Hungry', 'Ready to Win', 'Super Smart'];\n    return [...feelings].sort(() => 0.5 - Math.random()).slice(0, 4);\n  });"
);

content = content.replace(
  "{['Curious', 'Scared', 'Excited', 'Happy'].map((feeling) => (",
  "{warmupOptions.map((feeling) => ("
);

fs.writeFileSync('src/components/Presentation.tsx', content);
