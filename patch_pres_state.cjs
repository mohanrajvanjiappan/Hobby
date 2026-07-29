const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldState = `  const [score, setScore] = useState(0);`;
const newState = `  const [score, setScore] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playersState, setPlayersState] = useState<any[]>(quiz.players || []);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());`;

content = content.replace(oldState, newState);

// Add 'question-selection' to Stage type
content = content.replace(
  "type Stage = 'intro' | 'question' | 'reveal' | 'quote' | 'score' | 'talk' | 'outro';",
  "type Stage = 'intro' | 'question-selection' | 'question' | 'reveal' | 'quote' | 'score' | 'talk' | 'outro';"
);

fs.writeFileSync('src/components/Presentation.tsx', content);
