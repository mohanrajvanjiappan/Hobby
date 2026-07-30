const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const search = `  const getAwardPoints = () => {
    let inc = (getAwardPoints());`;

const replace = `  const getAwardPoints = () => {
    let inc = (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);`;

content = content.replace(search, replace);
fs.writeFileSync('src/components/Presentation.tsx', content);
