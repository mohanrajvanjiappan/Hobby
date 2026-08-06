const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// Replace combineUploadedFiles logic
code = code.replace(
  /for \(const item of jsonItemsCloned\) {[\s\S]*?combinedQuestions\.push\(\.\.\.item\.questions\);\n      }\n    }/,
  `// First pass to determine firstType, firstTitle, firstTopic
    for (const item of [...jsonItemsCloned, ...imageItems]) {
      if (!firstTitle && item.title) firstTitle = item.title;
      if (!firstTopic && item.topic) firstTopic = item.topic;
      if (!firstType && item.type) firstType = item.type;
    }
    
    const assumedType = firstType || quizType || 'multiple-choice';

    for (const item of jsonItemsCloned) {
      const questionsWithPlayerIdx = item.questions.map(q => ({
        ...q,
        playerIndex: undefined,
        category: assumedType === 'rapid-fire' ? (item.title || \`Set \${playerIdxCounter + 1}\`) : q.category,
        timeLimit: assumedType === 'rapid-fire' ? ((item as any).timeLimit || q.timeLimit || 60) : q.timeLimit
      }));
      combinedQuestions.push(...questionsWithPlayerIdx);
      if (assumedType === 'rapid-fire') {
        playerIdxCounter++;
      }
      if (item.quotes && item.quotes.length > 0) {
        combinedQuotes.push(...item.quotes);
      }
    }

    for (const item of imageItems) {
      if (!matchedImageIds.has(item.id)) {
        combinedQuestions.push(...item.questions);
      }
    }`
);

fs.writeFileSync('src/components/Setup.tsx', code);
