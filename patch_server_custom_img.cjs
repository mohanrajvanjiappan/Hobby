const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  "const { topic, numQuestions, difficulty, quizType = 'multiple-choice' } = req.body;",
  "const { topic, numQuestions, difficulty, quizType = 'multiple-choice', customItems } = req.body;"
);

content = content.replace(
  "let contents = `Generate a kids quiz about \"${topic}\". The difficulty should be ${difficulty}. Generate ${targetNumQuestions} questions.`;",
  "let contents = `Generate a kids quiz about \"${topic}\". The difficulty should be ${difficulty}. Generate ${targetNumQuestions} questions.`;\n      if (customItems && customItems.length > 0) {\n        contents = `This is an 'Identify the Image' round based on custom items. There are ${customItems.length} items. Generate exactly 1 question for each item. For each item: - The 'id' MUST exactly match the provided item id. - The 'question' should be 'Identify this ${topic}'. - The 'correctAnswer' MUST exactly match the provided item name. - Generate 3 plausible but incorrect options related to '${topic}'. The final 'options' array must contain the correct answer and the 3 incorrect options, shuffled. - 'timeLimit' should be 10 seconds. Here are the items: ${JSON.stringify(customItems)}`;\n      }"
);

content = content.replace(
  "let requiredQuestionProps = [\"question\", \"correctAnswer\", \"timeLimit\"];",
  "if (customItems && customItems.length > 0) { questionSchemaProps.id = { type: Type.STRING, description: \"The exact ID of the item\" }; }\n      let requiredQuestionProps = [\"question\", \"correctAnswer\", \"timeLimit\"];\n      if (customItems && customItems.length > 0) { requiredQuestionProps.push(\"id\"); }"
);

content = content.replace(
  "if (topic.toLowerCase().startsWith(\"identify\") || quizType === 'identify-image') {\n        for (const q of quizData.questions) {\n          let base64Image = null;",
  "if ((!customItems || customItems.length === 0) && (topic.toLowerCase().startsWith(\"identify\") || quizType === 'identify-image')) {\n        for (const q of quizData.questions) {\n          let base64Image = null;"
);

fs.writeFileSync('server.ts', content);
