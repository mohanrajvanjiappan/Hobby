const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const targetStr = `const [players, setPlayers] = useState<any[]>([{ id: '1', name: file.name.replace(/\\.[^/.]+$/, "").replace(/[_-]/g, " "), photo: '', details: '', topic: '', score: 0 }]);`;
const replaceStr = `const [players, setPlayers] = useState<any[]>([{ id: '1', name: '', photo: '', details: '', topic: '', score: 0 }]);`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/components/Setup.tsx', content);
console.log("Patched players state!");
