const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');
content = content.replace(
  /const \[imageError, setImageError\] = useState\(false\);/,
  `const [imageError, setImageError] = useState(false);
  const [score, setScore] = useState(0);
  const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);`
);
content = content.replace(
  /useEffect\(\(\) => \{\n\s*setImageError\(false\);\n\s*\}, \[currentQuestionIndex\]\);/,
  `useEffect(() => {
    setImageError(false);
    setInteractiveOptionClicked(null);
  }, [currentQuestionIndex]);`
);
fs.writeFileSync('src/components/Presentation.tsx', content);
