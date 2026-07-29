const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const fullTemplate = `[
  {
    "id": 1,
    "brand_name": "Tesla",
    "image_file_name": "tesla-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/tesla-logo.png"
  },
  {
    "id": 2,
    "brand_name": "Toyota",
    "image_file_name": "toyota-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/toyota-logo.png"
  },
  {
    "id": 3,
    "brand_name": "Ford",
    "image_file_name": "ford-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/ford-logo.png"
  },
  {
    "id": 4,
    "brand_name": "Honda",
    "image_file_name": "honda-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/honda-logo.png"
  },
  {
    "id": 5,
    "brand_name": "BMW",
    "image_file_name": "bmw-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/bmw-logo.png"
  },
  {
    "id": 6,
    "brand_name": "Subaru",
    "image_file_name": "subaru-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/subaru-logo.png"
  },
  {
    "id": 7,
    "brand_name": "Hyundai",
    "image_file_name": "hyundai-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/hyundai-logo.png"
  },
  {
    "id": 8,
    "brand_name": "Audi",
    "image_file_name": "audi-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/audi-logo.png"
  },
  {
    "id": 9,
    "brand_name": "Jeep",
    "image_file_name": "jeep-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/jeep-logo.png"
  },
  {
    "id": 10,
    "brand_name": "Porsche",
    "image_file_name": "porsche-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/porsche-logo.png"
  },
  {
    "id": 11,
    "brand_name": "Dodge",
    "image_file_name": "dodge-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/dodge-logo.png"
  },
  {
    "id": 12,
    "brand_name": "Ferrari",
    "image_file_name": "ferrari-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/ferrari-logo.png"
  },
  {
    "id": 13,
    "brand_name": "Jaguar",
    "image_file_name": "jaguar-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/jaguar-logo.png"
  },
  {
    "id": 14,
    "brand_name": "Lamborghini",
    "image_file_name": "lamborghini-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/lamborghini-logo.png"
  },
  {
    "id": 15,
    "brand_name": "Maserati",
    "image_file_name": "maserati-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/maserati-logo.png"
  },
  {
    "id": 16,
    "brand_name": "Bentley",
    "image_file_name": "bentley-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/bentley-logo.png"
  },
  {
    "id": 17,
    "brand_name": "Chrysler",
    "image_file_name": "chrysler-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/chrysler-logo.png"
  },
  {
    "id": 18,
    "brand_name": "Chevrolet Corvette",
    "image_file_name": "chevrolet-corvette-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/chevrolet-corvette-logo.png"
  },
  {
    "id": 19,
    "brand_name": "Cadillac",
    "image_file_name": "cadillac-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/cadillac-logo.png"
  }
]`;

const oldTemplateCode = `  const downloadJsonTemplate = () => {
    const template = [
      {
        "id": 1,
        "brand_name": "Tesla",
        "image_file_name": "tesla-logo.png",
        "image_url": "https://www.carlogos.org/car-logos/tesla-logo.png"
      },
      {
        "id": 2,
        "brand_name": "Toyota",
        "image_file_name": "toyota-logo.png",
        "image_url": "https://www.carlogos.org/car-logos/toyota-logo.png"
      }
    ];`;

const newTemplateCode = `  const downloadJsonTemplate = () => {
    const template = ${fullTemplate};`;

content = content.replace(oldTemplateCode, newTemplateCode);

// Also maybe they click the big "Template" button at the bottom while in identify-image mode?
// Let's modify downloadTemplate to provide this if quizType === 'identify-image'
const oldDlTemplate = `    } else if (quizType === 'combat-mode') {
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

const newDlTemplate = `    } else if (quizType === 'combat-mode') {
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
    } else if (quizType === 'identify-image') {
      title = "Offline Identify Image Quiz";
      finalType = "identify-image";
      dlName = "identify-image";
      questions = [
        {
          question: "Identify this brand",
          imageUrl: "https://www.carlogos.org/car-logos/tesla-logo.png",
          options: ["Tesla", "Toyota", "Ford", "Honda"],
          correctAnswer: "Tesla",
          timeLimit: 10
        }
      ];
    } else {`;

content = content.replace(oldDlTemplate, newDlTemplate);

fs.writeFileSync('src/components/Setup.tsx', content);
