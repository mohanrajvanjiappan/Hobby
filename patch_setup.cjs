const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// Replace state variables
content = content.replace(
  "const [teamName, setTeamName] = useState('');",
  "const [numPlayers, setNumPlayers] = useState(1);\n  const [players, setPlayers] = useState<any[]>([{ id: '1', name: '', photo: '', details: '', topic: '', score: 0 }]);"
);

// We need to keep teamName etc because there might be other references. Let's just add the new variables.
content = content.replace(
  "const [numPlayers, setNumPlayers] = useState(1);",
  "const [teamName, setTeamName] = useState('');\n  const [numPlayers, setNumPlayers] = useState(1);"
);

fs.writeFileSync('src/components/Setup.tsx', content);
