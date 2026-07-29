const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const target2 = "contents = `This is an 'Identify the Image' round based on custom items. There are ${customItems.length} items. Generate exactly 1 question for each item. For each item: - The 'id' MUST exactly match the provided item id. - The 'question' should be 'Identify this ${topic}'. - The 'correctAnswer' MUST exactly match the provided item name. - Generate 3 plausible but incorrect options related to '${topic}'. The final 'options' array must contain the correct answer and the 3 incorrect options, shuffled. - 'timeLimit' should be 10 seconds. Here are the items: ${JSON.stringify(customItems)}`;";

const replace2 = "contents = `This is an 'Identify the Image' round based on custom items. There are ${customItems.length} items. Generate exactly 1 question for each item. For each item: - The 'id' MUST exactly match the provided item id. - The 'question' should be 'Identify this ${topic === 'Item' ? 'Item' : topic}'. - The 'correctAnswer' MUST exactly match the provided item name. - Generate 3 plausible but incorrect options. If the items share a common category, use that category for the incorrect options. The final 'options' array must contain the correct answer and the 3 incorrect options, shuffled. - 'timeLimit' should be 10 seconds. Here are the items: ${JSON.stringify(customItems)}`;";

content = content.replace(target2, replace2);
fs.writeFileSync('server.ts', content);
console.log("Patched server prompt");
