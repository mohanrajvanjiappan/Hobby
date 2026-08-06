import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import google from "googlethis";

const generateWordSearchGrid = (words: string[]) => {
  const size = 10; // Increased size to ensure 5 words fit easily
  let grid: string[][] = [];
  let wordLocations: any[] = [];
  let allPlaced = false;

  const directions = [
    [0, 1], // Left to Right
    [1, 0], // Top to Bottom
  ];

  // format and sort words by length descending
  const sortedWords = [...words]
    .map(w => w.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 8))
    .sort((a, b) => b.length - a.length);

  while (!allPlaced) {
    grid = Array.from({ length: size }, () => Array(size).fill(''));
    wordLocations = [];
    allPlaced = true;
    
    for (const word of sortedWords) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 500) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        
        let canPlace = true;
        const cells = [];
        for (let i = 0; i < word.length; i++) {
          const nr = r + dir[0] * i;
          const nc = c + dir[1] * i;
          if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
            canPlace = false;
            break;
          }
          if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) {
            canPlace = false;
            break;
          }
          cells.push({ r: nr, c: nc });
        }
        
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[cells[i].r][cells[i].c] = word[i];
          }
          wordLocations.push({ word, cells });
          placed = true;
        }
        attempts++;
      }
      
      if (!placed) {
        allPlaced = false;
        break; // Retry entire grid
      }
    }
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, wordLocations, wordsToFind: wordLocations.map(w => w.word) };
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  
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

      const prompt = `Convert the following text into an engaging animated presentation. 
The presentation should have exactly ${numSlides} slides.
For each slide:
- 'question' is the main heading of the slide.
- 'clues' is an array of 2-4 bullet points (short sentences) for the slide.
- 'insight' is the full script to be spoken for this slide (must cover all the bullet points in an engaging way).
- 'timeLimit' must be exactly ${timeLimitPerSlide}.

Text Content:
"""
${textContent}
"""
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
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

      const data = JSON.parse(response.text || "{}");
      
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

  app.post("/api/generate-quiz", async (req, res) => {
    try {
      let { topic, numQuestions, difficulty, quizType = 'multiple-choice', customItems, identifyMultiChoice = true } = req.body;
      if (!topic || !topic.trim()) {
        topic = 'Item';
      }

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

      let targetNumQuestions = numQuestions;
      if (quizType === 'identify-image') {
        targetNumQuestions = numQuestions + 5; // Generate extra questions in case image fetching fails
      }
      let contents = `Generate a kids quiz about "${topic}". The difficulty should be ${difficulty}. Generate ${targetNumQuestions} questions.`;
      if (customItems && customItems.length > 0) {
        if (identifyMultiChoice) {
          contents = `This is an 'Identify the Image' round based on custom items. There are ${customItems.length} items. Generate exactly 1 question for each item. For each item: - The 'id' MUST exactly match the provided item id. - The 'question' should be 'Identify this ${topic === 'Item' ? 'Item' : topic}'. - The 'correctAnswer' MUST exactly match the provided item name. - Generate 3 plausible but incorrect options. If the items share a common category, use that category for the incorrect options. The final 'options' array must contain the correct answer and the 3 incorrect options, shuffled. - 'timeLimit' should be 10 seconds. Here are the items: ${JSON.stringify(customItems)}`;
        } else {
          contents = `This is an 'Identify the Image' round based on custom items. There are ${customItems.length} items. Generate exactly 1 question for each item. For each item: - The 'id' MUST exactly match the provided item id. - The 'question' should be 'Identify this ${topic === 'Item' ? 'Item' : topic}'. - The 'correctAnswer' MUST exactly match the provided item name. DO NOT generate options. - 'timeLimit' should be 10 seconds. Here are the items: ${JSON.stringify(customItems)}`;
        }
      }
      
      let questionSchemaProps: any = {
        question: { type: Type.STRING, description: "The quiz question text. CRITICAL: If the quiz is to identify a movie/show, DO NOT mention the movie/show name in the question text." },
        correctAnswer: { type: Type.STRING, description: "The exact correct answer string." },
        timeLimit: { type: Type.NUMBER, description: "Time limit in seconds (usually 10, but use 20 for find-in-map rounds)." },
        imageSearchQuery: { type: Type.STRING, description: "If the quiz involves images, provide a highly specific Google Image Search query to fetch an accurate image. CRITICAL: Ensure the query fetches exactly the intended subject. Use highly specific terms (e.g., '2023 Ford Mustang car side view' not 'Mustang', 'Golden Retriever dog' not 'Dog'). Avoid generic terms that return unrelated images. CRITICAL RULE FOR MOVIES/TV SHOWS: You ABSOLUTELY MUST NOT search for the movie/show's poster. Instead, search for a lead actor portrait or a general object." }
      };
      if (customItems && customItems.length > 0) { questionSchemaProps.id = { type: Type.STRING, description: "The exact ID of the item" }; }
      let requiredQuestionProps = ["question", "correctAnswer", "timeLimit"];
      if (customItems && customItems.length > 0) { requiredQuestionProps.push("id"); }

      if (quizType !== 'detective' && quizType !== 'jumbled-letters' && quizType !== 'match-the-following' && quizType !== 'combat-mode' && quizType !== 'identify-image') {
        requiredQuestionProps.push("options");
        questionSchemaProps.options = {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "4 multiple choice options."
        };
      } else if (quizType === 'identify-image') {
        if (identifyMultiChoice) {
          requiredQuestionProps.push("options");
          questionSchemaProps.options = {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "4 multiple choice options."
          };
        }
      }

      if (quizType === 'identify-image') {
        if (identifyMultiChoice) {
          contents += ` This is an 'Identify the Image' round. For each question, provide a 'question' which is just 'Identify this [topic/category]', the 'correctAnswer', and 4 'options'. 
CRITICAL RULES FOR ACCURACY:
1. The answers MUST be strictly limited to the user's specific requested topic: "${topic}". If the topic is 'cars', ONLY use actual cars (e.g., Ford Mustang, Toyota Corolla), DO NOT use buses, trucks, or motorcycles. If it's 'dogs', ONLY use dog breeds.
2. Provide an 'imageSearchQuery' to fetch a highly specific, high-quality photo of the answer. Add terms like "-watermark -stock", "high quality", "clear photo", or "isolated" to ensure good results. DO NOT mention the answer in the question text.`;
        } else {
          contents += ` This is an 'Identify the Image' round. For each question, provide a 'question' which is just 'Identify this [topic/category]' and the 'correctAnswer'. DO NOT generate 'options'.
CRITICAL RULES FOR ACCURACY:
1. The answers MUST be strictly limited to the user's specific requested topic: "${topic}". If the topic is 'cars', ONLY use actual cars (e.g., Ford Mustang, Toyota Corolla), DO NOT use buses, trucks, or motorcycles. If it's 'dogs', ONLY use dog breeds.
2. Provide an 'imageSearchQuery' to fetch a highly specific, high-quality photo of the answer. Add terms like "-watermark -stock", "high quality", "clear photo", or "isolated" to ensure good results. DO NOT mention the answer in the question text.`;
        }
      } else if (quizType === '5-clues') {
        contents += ` This is a 'Guess in 5 clues' round. For each question, provide exactly 5 simple clues that progressively reveal the answer. The question text can be like 'Who am I?', 'What am I?', or 'Where am I?'. Provide 4 multiple choice options.`;
        questionSchemaProps.clues = {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Exactly 5 simple clues that progressively reveal the answer."
        };
        requiredQuestionProps.push("clues");
      } else if (quizType === 'jumbled-letters') {
        contents += ` This is a 'Jumbled Letters' round. For each question, provide a jumbled word related to the theme in the 'question' field (e.g., if the answer is 'COMPUTER', the question should be a jumbled string like 'T E M P O C U R'). Provide exactly 2 clues for the word in the 'clues' array. Do not provide multiple choice options. The 'correctAnswer' is the unjumbled word.`;
        questionSchemaProps.clues = {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Exactly 2 simple clues for the jumbled word."
        };
        requiredQuestionProps.push("clues");
      } else if (quizType === 'detective') {
        contents += ` This is a 'Be a Detective' round. For each question, provide a statement like 'Find the fake fact about [topic]'. Provide exactly 5 sentences related to the theme. Exactly one sentence must contain fake/inaccurate information, and the other 4 must be true. CRITICAL: The fake fact MUST NOT always be the last sentence. Randomize the position (index 0-4) of the fake fact for each question so it is unpredictable. Also provide the index of the fake sentence (0-4) and an insight explaining why it is inaccurate. The correctAnswer should be a short statement of the truth. Do not provide multiple choice options.`;
        questionSchemaProps.sentences = {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Exactly 5 sentences, where one is fake and 4 are true."
        };
        questionSchemaProps.fakeSentenceIndex = {
          type: Type.NUMBER,
          description: "The 0-based index of the fake sentence in the sentences array."
        };
        questionSchemaProps.insight = {
          type: Type.STRING,
          description: "An explanation of why the fake sentence is inaccurate."
        };
        requiredQuestionProps.push("sentences", "fakeSentenceIndex", "insight");
      } else if (quizType === 'match-the-following') {
        contents += ` This is a 'Match the Following' round. For each question, provide a prompt in 'question' (e.g., 'Match the items'). Provide exactly 5 matching pairs related to the theme in the 'pairs' array. Do not provide multiple choice options. The 'correctAnswer' should just be a simple statement like 'Matches revealed'.`;
        questionSchemaProps.pairs = {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              left: { type: Type.STRING, description: "The item on the left side." },
              right: { type: Type.STRING, description: "The corresponding matching item on the right side." }
            },
            required: ["left", "right"]
          },
          description: "Exactly 5 matching pairs."
        };
        requiredQuestionProps.push("pairs");
      } else if (quizType === 'combat-mode') {
        contents += ` This is a 'Combat Mode' round. For each question, provide 2 similar questions of the same difficulty. One for the 'left' player and one for the 'right' player. Do NOT provide standard 'options' or 'correctAnswer' for the main object, instead provide them inside 'combatLeft' and 'combatRight' objects. The main 'question' field can just be 'Round X'. The 'correctAnswer' can just be 'Answers revealed'.`;
        
        const combatSchema = {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer"]
        };
        
        questionSchemaProps.combatLeft = combatSchema;
        questionSchemaProps.combatRight = combatSchema;
        requiredQuestionProps.push("combatLeft", "combatRight");
      } else if (quizType === 'find-in-map') {
        contents += ` This is a 'Find in Map' round. For each question, ask the user to identify a country or state shown on a map. Provide a 'nominatimQuery' which is the exact search query to find this location on OpenStreetMap (e.g., 'Texas, USA', 'France', 'Tokyo, Japan'). Also provide a 'parentRegionQuery' which is the country or broader region for the initial long shot view (e.g., 'USA' for Texas, or 'World' for France). Provide 4 multiple choice options.`;
        questionSchemaProps.nominatimQuery = {
          type: Type.STRING,
          description: "The exact OpenStreetMap Nominatim search query for the correct answer (e.g., 'Texas, USA')."
        };
        questionSchemaProps.parentRegionQuery = {
          type: Type.STRING,
          description: "The OpenStreetMap Nominatim search query for the parent region (e.g., 'USA'). If the answer is a country, set this to 'World'."
        };
        requiredQuestionProps.push("nominatimQuery", "parentRegionQuery");
      } else if (quizType === 'word-search') {
        contents += ` This is a 'Word Search' round. For each question, provide a list of exactly 5 words related to the theme in 'wordsToFind'. Each word MUST be a maximum of 8 characters long, uppercase, with no spaces. CRITICAL: DOUBLE CHECK THE SPELLING of every word to ensure it is a correct and valid English word. The 'question' field should just be 'Find the 5 hidden words!'. The 'correctAnswer' should be 'Words found!'.`;
        questionSchemaProps.wordsToFind = {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Exactly 5 words, max 8 chars each, uppercase, no spaces."
        };
        requiredQuestionProps.push("wordsToFind");
      } else if (quizType === 'mega-quiz') {
        contents += ` This is a Mega Quiz. Generate a wide mix of questions from all possible categories (history, science, geography, pop culture, sports, arts, literature, movies, logic, etc). For each question, provide 4 options. Ensure the questions are diverse and fun.`;
      } else if (quizType === 'rapid-fire') {
        contents += ` This is a 'Rapid Fire' round. Provide short, snappy questions and 4 options each. The questions should be quick to read and answer.`;
      } else {
        contents += ` This is a multiple choice quiz. For each question, provide 4 options.`;
      }

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents,
            config: {
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
            },
          });
          break; // Success, exit retry loop
        } catch (error: any) {
          console.error(`Attempt failed: ${error.message}`);
          if (error.status === 429 || error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.status === "RESOURCE_EXHAUSTED") {
            throw new Error("You have reached the AI generation rate limit. Please wait about a minute and try again.");
          }
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds before retry
        }
      }

      const text = response?.text;
      if (!text) {
        throw new Error("No response from Gemini.");
      }
      
      const quizData = JSON.parse(text);
      quizData.topic = topic;
      quizData.type = quizType;

      const staticQuotes = [
        { quote: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
        { quote: "Anyone who has never made a mistake has never tried anything new.", author: "Albert Einstein" },
        { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
        { quote: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
        { quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
        { quote: "Play is the highest form of research.", author: "Albert Einstein" },
        { quote: "Education is not the learning of facts, but the training of the mind to think.", author: "Albert Einstein" },
        { quote: "Nothing is impossible, the word itself says 'I'm possible'!", author: "Audrey Hepburn" },
        { quote: "It always seems impossible until it is done.", author: "Nelson Mandela" },
        { quote: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison" },
        { quote: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
        { quote: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
        { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" }
      ];
      try {
        const shuffled = [...staticQuotes].sort(() => 0.5 - Math.random());
        quizData.quotes = shuffled.slice(0, 3).map(q => ({ text: q.quote, author: q.author }));
      } catch (e) {
        console.error("Failed to load quotes", e);
        quizData.quotes = [];
      }

      if ((!customItems || customItems.length === 0) && (topic.toLowerCase().startsWith("identify") || quizType === 'identify-image')) {
        for (const q of quizData.questions) {
          let base64Image = null;
          let imageUrlsToTry = [];

          // 1. Try Wikipedia API first using the exact correct answer
          if (q.correctAnswer) {
            try {
              const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q.correctAnswer)}&format=json`);
              const searchData = await searchRes.json();
              const title = searchData.query?.search?.[0]?.title;
              
              if (title) {
                const imgRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`);
                const imgData = await imgRes.json();
                const pages = imgData.query?.pages;
                if (pages) {
                  const pageId = Object.keys(pages)[0];
                  const source = pages[pageId]?.original?.source;
                  if (source) {
                    imageUrlsToTry.push(source);
                  }
                }
              }
            } catch (e) {
              console.error("Wikipedia search failed for", q.correctAnswer, e);
            }
          }

          // 2. Fallback to Google Image Search if Wikipedia fails or we want backups
          if (q.imageSearchQuery) {
            try {
              const options = { page: 0, safe: false, additional_params: { hl: 'en' } };
              const images = await google.image(q.imageSearchQuery, options);
              if (images && images.length > 0) {
                for (const img of images) {
                  if (img.url) imageUrlsToTry.push(img.url);
                  if (img.preview?.url) imageUrlsToTry.push(img.preview.url);
                }
              }
            } catch (e) {
              console.error("Failed to fetch image for", q.imageSearchQuery, e);
            }
          }

          // 3. Try fetching the URLs
          for (const targetUrl of imageUrlsToTry) {
            if (!targetUrl) continue;
            try {
              const fetchRes = await fetch(targetUrl, { 
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" },
                signal: AbortSignal.timeout(5000)
              });
              if (fetchRes.ok) {
                const arrayBuffer = await fetchRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64 = buffer.toString('base64');
                const mimeType = fetchRes.headers.get('content-type') || 'image/jpeg';
                if (mimeType.startsWith('image/') || mimeType === 'application/octet-stream') {
                  base64Image = `data:${mimeType === 'application/octet-stream' ? 'image/jpeg' : mimeType};base64,${base64}`;
                  break;
                }
              }
            } catch (err) {
              continue;
            }
          }

          if (base64Image) {
            q.imageUrl = base64Image;
            q.imagePreviewUrl = base64Image;
          }
        }
        
        quizData.questions = quizData.questions.filter(q => q.imageUrl);
        if (quizData.questions.length === 0) {
          return res.status(500).json({ error: "Failed to fetch accurate images for the requested topic. Please try a different topic or less obscure subjects." });
        }
        quizData.questions = quizData.questions.slice(0, numQuestions);
      }

      if (quizType === 'word-search') {
        for (const q of quizData.questions) {
          if (q.wordsToFind && Array.isArray(q.wordsToFind)) {
            const { grid, wordLocations, wordsToFind } = generateWordSearchGrid(q.wordsToFind);
            q.grid = grid;
            q.wordLocations = wordLocations;
            q.wordsToFind = wordsToFind;
          }
        }
      }

      res.json(quizData);
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ error: error.message || "Failed to generate quiz." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
