const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');
if (content.includes('isInteractiveCorrect = interactiveOptionClicked === question.sentences?.[question.fakeSentenceIndex];')) {
  console.log("TS error potential: question.sentences might be undefined, and fakeSentenceIndex might be undefined.");
  content = content.replace('isInteractiveCorrect = interactiveOptionClicked === question.sentences?.[question.fakeSentenceIndex];', 'isInteractiveCorrect = interactiveOptionClicked === (question.sentences && question.fakeSentenceIndex !== undefined ? question.sentences[question.fakeSentenceIndex] : undefined);');
  fs.writeFileSync('src/components/Presentation.tsx', content);
}
