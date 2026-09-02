export const generateWordSearchGrid = (words: string[]) => {
  const size = 6; // Increased size to ensure 5 words fit easily
  let grid: string[][] = [];
  let wordLocations: any[] = [];
  let allPlaced = false;

  const directions = [
    [0, 1], // Left to Right
    [1, 0], // Top to Bottom
  ];

  // format and sort words by length descending
  const sortedWords = [...words]
    .map(w => w.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 6))
    .sort((a, b) => b.length - a.length);

  while (!allPlaced) {
    grid = Array.from({ length: size }, () => Array(size).fill(''));
    wordLocations = [];
    allPlaced = true;
    
    for (const word of sortedWords) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 500) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        
        let canPlace = true;
        const cells: {r: number, c: number}[] = [];
        for (let i = 0; i < word.length; i++) {
          const nr = r + dir[0] * i;
          const nc = c + dir[1] * i;
          if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
            canPlace = false;
            break;
          }
          if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) {
            canPlace = false;
            break;
          }
          cells.push({ r: nr, c: nc });
        }
        
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[cells[i].r][cells[i].c] = word[i];
          }
          wordLocations.push({ word, cells });
          placed = true;
        }
        attempts++;
      }
      
      if (!placed) {
        allPlaced = false;
        break; // Retry entire grid
      }
    }
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, wordLocations, wordsToFind: wordLocations.map(w => w.word) };
};
