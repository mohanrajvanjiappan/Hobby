const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// Replace score calculation for badges
const badgeLogicReplace = `
      const topicWord = quiz.topic.split(' ')[0] || 'Quiz';
      const scorePerQuestion = quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1;
      
      if (quiz.isMultiplayer) {
        playersState.forEach(p => {
          if (p.score === quiz.questions.length * scorePerQuestion && quiz.questions.length > 0) {
            generatedBadges.push({ player: p.name, name: 'Perfect Score', icon: '🏆', description: 'Answered everything correctly!' });
          } else if (p.score >= (quiz.questions.length / 2) * scorePerQuestion && quiz.questions.length > 0) {
`;

content = content.replace(
`      const topicWord = quiz.topic.split(' ')[0] || 'Quiz';
      
      if (quiz.isMultiplayer) {
        playersState.forEach(p => {
          if (p.score === quiz.questions.length && quiz.questions.length > 0) {
            generatedBadges.push({ player: p.name, name: 'Perfect Score', icon: '🏆', description: 'Answered everything correctly!' });
          } else if (p.score >= quiz.questions.length / 2 && quiz.questions.length > 0) {`, badgeLogicReplace);


const badgeLogicReplace2 = `      } else {
        const pName = quiz.teamName || 'Player 1';
        if (score === quiz.questions.length * scorePerQuestion && quiz.questions.length > 0) {
          generatedBadges.push({ player: pName, name: 'Perfect Score', icon: '🏆', description: 'Answered everything correctly!' });
        } else if (score >= (quiz.questions.length / 2) * scorePerQuestion && quiz.questions.length > 0) {`;

content = content.replace(
`      } else {
        const pName = quiz.teamName || 'Player 1';
        if (score === quiz.questions.length && quiz.questions.length > 0) {
          generatedBadges.push({ player: pName, name: 'Perfect Score', icon: '🏆', description: 'Answered everything correctly!' });
        } else if (score >= quiz.questions.length / 2 && quiz.questions.length > 0) {`, badgeLogicReplace2);


// Replace score increments
content = content.replace(/setScore\(s => s \+ 1\);/g, "setScore(s => s + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1));");
content = content.replace(/score: next\[currentPlayerIndex\].score \+ 1/g, "score: next[currentPlayerIndex].score + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1)");


fs.writeFileSync('src/components/Presentation.tsx', content);
console.log("Patched score increments and badges!");
