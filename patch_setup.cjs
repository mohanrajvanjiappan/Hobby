const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// Be careful around `(quizType === 'identify-image' || quizType === 'multiple-choice')` -> `((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice')` which is valid JS.
code = code.replace(/quizType === 'identify-image'/g, "(quizType === 'identify-image' || quizType === 'blurred-image')");

// Also add to the dropdown
code = code.replace('<option value="identify-image">Identify the Image</option>', 
                    '<option value="identify-image">Identify the Image</option>\n              <option value="blurred-image">Guess the Blurred Image</option>');

// Add the template for blurred-image
const templateIdentify = `    } else if ((quizType === 'identify-image' || quizType === 'blurred-image')) {`;
const templateBlurred = `    } else if (quizType === 'blurred-image') {
      title = "Offline Blurred Image Quiz";
      finalType = "blurred-image";
      dlName = "blurred-image";
      questions = [
        {
          question: "Can you identify this blurred brand?",
          imageUrl: "https://www.carlogos.org/car-logos/tesla-logo.png",
          options: ["Tesla", "Toyota", "Ford", "Honda"],
          correctAnswer: "Tesla",
          blurTechnique: "heavy-blur",
          timeLimit: 15
        },
        {
          question: "Identify this blurred character",
          imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a9/MarioPortrait.png",
          options: ["Mario", "Luigi", "Sonic", "Link"],
          correctAnswer: "Mario",
          blurTechnique: "pixelated-blur",
          timeLimit: 15
        }
      ];
    } else if (quizType === 'identify-image') {`;

code = code.replace(templateIdentify, templateBlurred);

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Done Setup");
