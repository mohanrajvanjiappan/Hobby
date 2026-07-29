const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const oldDownload = `    } else if (quizType === 'detective') {
      title = "Offline Be a Detective Quiz";
      finalType = "detective";
      dlName = "detective";
      questions = [
        {
          question: "Which of these facts about the Solar System is false?",
          sentences: [
            "Jupiter is the largest planet.",
            "Mars is known as the Red Planet.",
            "Earth has one moon.",
            "Saturn has rings.",
            "The Sun is a planet."
          ],
          fakeSentenceIndex: 4,
          insight: "The Sun is a star, not a planet.",
          timeLimit: 30
        }
      ];
    } else {
      questions = [
        {
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: "4",
          insight: "Simple addition.",
          timeLimit: 10
        }
      ];
    }`;

const newDownload = `    } else if (quizType === 'detective') {
      title = "Offline Be a Detective Quiz";
      finalType = "detective";
      dlName = "detective";
      questions = [
        {
          question: "Which of these facts about the Solar System is false?",
          sentences: [
            "Jupiter is the largest planet.",
            "Mars is known as the Red Planet.",
            "Earth has one moon.",
            "Saturn has rings.",
            "The Sun is a planet."
          ],
          fakeSentenceIndex: 4,
          insight: "The Sun is a star, not a planet.",
          timeLimit: 30
        }
      ];
    } else if (quizType === 'jumbled-letters') {
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
    } else {
      questions = [
        {
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: "4",
          insight: "Simple addition.",
          timeLimit: 10
        }
      ];
    }`;

content = content.replace(oldDownload, newDownload);
fs.writeFileSync('src/components/Setup.tsx', content);
