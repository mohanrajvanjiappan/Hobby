const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Add blurTechnique to schema
const targetSchema = `insightImageSearchQuery: { type: Type.STRING, description: "Extract 2-4 highly relevant keywords from the insight text and the main topic to find a highly accurate image. ONLY use visual nouns (e.g. 'Eiffel Tower Paris', 'Golden Retriever dog'). Do NOT use full sentences or verbs." }`;

const replacementSchema = `insightImageSearchQuery: { type: Type.STRING, description: "Extract 2-4 highly relevant keywords from the insight text and the main topic to find a highly accurate image. ONLY use visual nouns (e.g. 'Eiffel Tower Paris', 'Golden Retriever dog'). Do NOT use full sentences or verbs." },
        blurTechnique: { type: Type.STRING, description: "For blurred-image quizzes. Choose a blur style: 'heavy-blur', 'pixelated-blur', 'grayscale-blur', or 'normal-blur'." }`;

code = code.replace(targetSchema, replacementSchema);

fs.writeFileSync('server.ts', code);
console.log("Done schema patch");
