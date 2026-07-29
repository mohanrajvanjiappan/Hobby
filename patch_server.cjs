const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const generatePresentationRoute = `
  app.post("/api/generate-presentation", async (req, res) => {
    try {
      const { content: textContent, duration } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const numSlides = Math.max(3, Math.min(20, Math.floor(duration * 2))); // Approx 30s per slide
      const timeLimitPerSlide = Math.floor((duration * 60) / numSlides);

      const prompt = \`Convert the following text into an engaging animated presentation. 
The presentation should have exactly \${numSlides} slides.
For each slide:
- 'question' is the main heading of the slide.
- 'clues' is an array of 2-4 bullet points (short sentences) for the slide.
- 'insight' is the full script to be spoken for this slide (must cover all the bullet points in an engaging way).
- 'timeLimit' must be exactly \${timeLimitPerSlide}.

Text Content:
"""
\${textContent}
"""
\`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Title of the presentation" },
              topic: { type: Type.STRING, description: "Short topic description" },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    clues: { type: Type.ARRAY, items: { type: Type.STRING } },
                    insight: { type: Type.STRING },
                    timeLimit: { type: Type.NUMBER },
                  },
                  required: ["question", "clues", "insight", "timeLimit"]
                }
              }
            },
            required: ["title", "topic", "questions"]
          }
        }
      });

      const data = JSON.parse(response.text() || "{}");
      
      const presentation = {
        title: data.title || "Presentation",
        topic: data.topic || "Topic",
        type: "text-presentation",
        theme: {
          primaryColor: "#4F46E5",
          secondaryColor: "#10B981",
          textColor: "#ffffff"
        },
        questions: (data.questions || []).map((q: any) => ({
          ...q,
          correctAnswer: "N/A"
        })),
        quotes: []
      };

      res.json(presentation);
    } catch (error) {
      console.error("Presentation generation error:", error);
      res.status(500).json({ error: "Failed to generate presentation." });
    }
  });
`;

content = content.replace('app.post("/api/generate-quiz",', generatePresentationRoute + '\n  app.post("/api/generate-quiz",');
fs.writeFileSync('server.ts', content);
