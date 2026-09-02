const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const regex = /questions = \[\s*\{\s*question: "Can you identify this blurred brand\?",[\s\S]*?timeLimit: 15\s*\}\s*\];/;

const newSetup = `questions = [
        {
          question: "Can you identify this blurred brand?",
          imageUrl: "https://www.carlogos.org/car-logos/tesla-logo.png",
          options: ["Tesla", "Toyota", "Ford", "Honda"],
          correctAnswer: "Tesla",
          blurTechnique: "heavy-blur",
          timeLimit: 15
        },
        {
          question: "Identify this pixelated character",
          imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a9/MarioPortrait.png",
          options: ["Mario", "Luigi", "Sonic", "Link"],
          correctAnswer: "Mario",
          blurTechnique: "pixelated-blur",
          timeLimit: 15
        },
        {
          question: "Guess the landmark (Inverted!)",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/800px-Tour_Eiffel_Wikimedia_Commons.jpg",
          options: ["Eiffel Tower", "Big Ben", "Statue of Liberty", "Colosseum"],
          correctAnswer: "Eiffel Tower",
          blurTechnique: "invert-blur",
          timeLimit: 15
        },
        {
          question: "What is this zoomed object?",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
          options: ["Cat", "Dog", "Rabbit", "Fox"],
          correctAnswer: "Cat",
          blurTechnique: "zoom-blur",
          timeLimit: 15
        }
      ];`;

code = code.replace(regex, newSetup);
fs.writeFileSync('src/components/Setup.tsx', code);
