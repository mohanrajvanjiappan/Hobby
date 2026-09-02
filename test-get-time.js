function getTimeTotal(question, currentType) {
  if (currentType === 'word-search') return question.timeLimit || 30;
  if (currentType === 'match-the-following') return question.timeLimit || 30;
  if (currentType === 'jumbled-sentences') return question.timeLimit || 30;
  if (currentType === 'rapid-fire') return question.timeLimit || 10;
  if (currentType === 'find-in-map') return question.timeLimit || 25;
  if (currentType === 'detective') return question.timeLimit || 25;
  return question.timeLimit || 15;
}
