const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// 1. Add themeMemoryBreak to destructuring
code = code.replace(
  "let { topic, numQuestions, difficulty, quizType = 'multiple-choice', customItems, identifyMultiChoice = true, includeImages = false } = req.body;",
  "let { topic, numQuestions, difficulty, quizType = 'multiple-choice', customItems, identifyMultiChoice = true, includeImages = false, themeMemoryBreak = false } = req.body;"
);

// 2. Refactor responseSchema to a variable
const originalConfig = `            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "A catchy title for the quiz video." },
                  theme: {
                    type: Type.OBJECT,
                    properties: {
                      primaryColor: { type: Type.STRING, description: "A vibrant primary hex color suitable for the topic." },
                      secondaryColor: { type: Type.STRING, description: "A matching secondary hex color." },
                      textColor: { type: Type.STRING, description: "A high contrast text color (usually #FFFFFF or #000000)." },
                    },
                    required: ["primaryColor", "secondaryColor", "textColor"]
                  },
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: questionSchemaProps,
                      required: requiredQuestionProps
                    }
                  }
                },
                required: ["title", "theme", "questions"]
              },
            },`;

const newConfig = `            config: {
              responseMimeType: "application/json",
              responseSchema: (() => {
                const props = {
                  title: { type: Type.STRING, description: "A catchy title for the quiz video." },
                  theme: {
                    type: Type.OBJECT,
                    properties: {
                      primaryColor: { type: Type.STRING, description: "A vibrant primary hex color suitable for the topic." },
                      secondaryColor: { type: Type.STRING, description: "A matching secondary hex color." },
                      textColor: { type: Type.STRING, description: "A high contrast text color (usually #FFFFFF or #000000)." },
                    },
                    required: ["primaryColor", "secondaryColor", "textColor"]
                  },
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: questionSchemaProps,
                      required: requiredQuestionProps
                    }
                  }
                };
                if (themeMemoryBreak) {
                  props.memoryBreakEmojis = {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "20 distinct, unique emoji characters highly related to the quiz topic. ONLY return the single emoji characters (e.g., '🍎'). Do not include any text."
                  };
                }
                return {
                  type: Type.OBJECT,
                  properties: props,
                  required: ["title", "theme", "questions"]
                };
              })(),
            },`;

code = code.replace(originalConfig, newConfig);

fs.writeFileSync('server.ts', code);
console.log("Done server patch");
