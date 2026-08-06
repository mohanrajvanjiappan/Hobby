const getAwardPoints = (quiz, currentType) => {
    let inc = (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
    if (quiz.mode === 'interactive' && currentType === '5-clues') {
      inc = 10;
    }
    return inc;
}
