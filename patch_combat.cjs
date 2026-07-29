const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const oldDownload = `    } else if (quizType === 'jumbled-letters') {
      title = "Offline Jumbled Letters";
      finalType = "jumbled-letters";
      dlName = "jumbled-letters";
      questions = [
        {
          question: "Which fruit is red and sweet?",
          clues: [
            "It grows on trees.",
            "It can be red, green, or yellow."
          ],
          correctAnswer: "Apple",
          timeLimit: 25
        }
      ];
    } else {`;

const newDownload = `    } else if (quizType === 'jumbled-letters') {
      title = "Offline Jumbled Letters";
      finalType = "jumbled-letters";
      dlName = "jumbled-letters";
      questions = [
        {
          question: "Which fruit is red and sweet?",
          clues: [
            "It grows on trees.",
            "It can be red, green, or yellow."
          ],
          correctAnswer: "Apple",
          timeLimit: 25
        }
      ];
    } else if (quizType === 'combat-mode') {
      title = "Offline Combat Mode";
      finalType = "combat-mode";
      dlName = "combat-mode";
      questions = [
        {
          question: "Round 1",
          combatLeft: {
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: "4"
          },
          combatRight: {
            question: "What is 3 + 3?",
            options: ["5", "6", "7", "8"],
            correctAnswer: "6"
          },
          correctAnswer: "Answers revealed",
          timeLimit: 15
        }
      ];
    } else {`;

content = content.replace(oldDownload, newDownload);
fs.writeFileSync('src/components/Setup.tsx', content);
