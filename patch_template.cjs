const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const oldDownload = `  const downloadTemplate = () => {
    let questions: any[] = [];
    let title = "Offline Custom Quiz";

    if (quizType === '5-clues') {
      title = "Offline Guess in 5 Clues";
      questions = [
        {
          question: "Who am I?",
          clues: [
            "I have four legs.",
            "I am known as man's best friend.",
            "I love to play fetch.",
            "I bark when I am happy.",
            "I wag my tail."
          ],
          options: ["Cat", "Dog", "Horse", "Elephant"],
          correctAnswer: "Dog",
          timeLimit: 15
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
    }

    const template = {
      title,
      topic: "Custom Topic",
      type: quizType === '5-clues' ? '5-clues' : "multiple-choice",
      theme: {
        primaryColor: "#4f46e5",
        secondaryColor: "#818cf8",
        textColor: "#ffffff"
      },
      questions,
      quotes: [
        {
          text: "Knowledge is power.",
          author: "Francis Bacon"
        }
      ]
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`quiz-template-\${quizType === '5-clues' ? '5-clues' : 'multiple-choice'}.json\`;
    a.click();
    URL.revokeObjectURL(url);
  };`;

const newDownload = `  const downloadTemplate = () => {
    let questions: any[] = [];
    let title = "Offline Custom Quiz";
    let finalType = "multiple-choice";
    let dlName = "multiple-choice";

    if (quizType === '5-clues') {
      title = "Offline Guess in 5 Clues";
      finalType = "5-clues";
      dlName = "5-clues";
      questions = [
        {
          question: "Who am I?",
          clues: [
            "I have four legs.",
            "I am known as man's best friend.",
            "I love to play fetch.",
            "I bark when I am happy.",
            "I wag my tail."
          ],
          options: ["Cat", "Dog", "Horse", "Elephant"],
          correctAnswer: "Dog",
          timeLimit: 15
        }
      ];
    } else if (quizType === 'detective') {
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
    }

    const template = {
      title,
      topic: "Custom Topic",
      type: finalType,
      theme: {
        primaryColor: "#4f46e5",
        secondaryColor: "#818cf8",
        textColor: "#ffffff"
      },
      questions,
      quotes: [
        {
          text: "Knowledge is power.",
          author: "Francis Bacon"
        }
      ]
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`quiz-template-\${dlName}.json\`;
    a.click();
    URL.revokeObjectURL(url);
  };`;

content = content.replace(oldDownload, newDownload);
fs.writeFileSync('src/components/Setup.tsx', content);
