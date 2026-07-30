const fs = require('fs');
const content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');
fs.writeFileSync('src/components/Presentation.tsx', content.replace(
  `const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);`,
  `const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);\n  const [usedFiftyFifty, setUsedFiftyFifty] = useState<Record<string, boolean>>({});\n  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);`
));
