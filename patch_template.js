import fs from 'fs';
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const targetMegaQuiz = `    } else if (quizType === 'mega-quiz') {`;
const replaceFindInMap = `    } else if (quizType === 'find-in-map') {
      title = "Offline Find in Map";
      finalType = "find-in-map";
      dlName = "find-in-map";
      questions = [
        {
          question: "Which city is highlighted on the map?",
          nominatimQuery: "Paris, France",
          parentRegionQuery: "France",
          options: ["London", "Paris", "Berlin", "Madrid"],
          correctAnswer: "Paris",
          timeLimit: 15
        },
        {
          question: "Identify the country shown below.",
          nominatimQuery: "Japan",
          parentRegionQuery: "Asia",
          options: ["China", "South Korea", "Japan", "Thailand"],
          correctAnswer: "Japan",
          timeLimit: 15
        }
      ];
    } else if (quizType === 'mega-quiz') {`;

if (!code.includes(targetMegaQuiz)) {
    console.error("targetMegaQuiz not found!");
}

code = code.replace(targetMegaQuiz, replaceFindInMap);
fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Patched Setup.tsx with find-in-map template!");
