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


import { search } from 'duckduckgo-images-api';
async function fetchImageForQuery(query: string): Promise<string | null> {
  let imageUrlsToTry: string[] = [];
  try {
    const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`);
    const searchData = await searchRes.json();
    const title = searchData.query?.search?.[0]?.title;
    if (title) {
      const imgRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`);
      const imgData = await imgRes.json();
      const pages = imgData.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        const source = pages[pageId]?.original?.source;
        if (source) imageUrlsToTry.push(source);
      }
    }
  } catch(e) {}
  
    try {
    const ddgImages = await searchDuckDuckGoImages(query + " high quality -watermark");
    imageUrlsToTry.push(...ddgImages);
  } catch(e) {}
  
  for (const targetUrl of imageUrlsToTry) {
    if (!targetUrl) continue;
    try {
      const fetchRes = await fetch(targetUrl, { 
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(3000)
      });
      if (fetchRes.ok) {
        const arrayBuffer = await fetchRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const mimeType = fetchRes.headers.get('content-type') || 'image/jpeg';
        if (mimeType.startsWith('image/') || mimeType === 'application/octet-stream') {
          return `data:${mimeType === 'application/octet-stream' ? 'image/jpeg' : mimeType};base64,${base64}`;
        }
      }
    } catch (err) {}
  }
  return null;
}


async function searchDuckDuckGoImages(query: string): Promise<string[]> {
  const imageUrls: string[] = [];
  try {
    const res1 = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const text1 = await res1.text();
    const match = text1.match(/vqd="([^"]+)"/);
    if (!match) return imageUrls;
    const vqd = match[1];

    const res2 = await fetch(`https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&o=json&vqd=${vqd}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await res2.json();
    if (data && data.results) {
      for (const res of data.results) {
        if (res.image) imageUrls.push(res.image);
      }
    }
  } catch (e) {
    console.error("DDG search failed", e);
  }
  return imageUrls;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  
  app.post("/api/refresh-insight-image", async (req, res) => {
    try {
      const { query, offset = 1 } = req.body;
      if (!query) return res.json({ image: null });
      
      let imageUrlsToTry = [];
      try {
        const ddgImages = await searchDuckDuckGoImages(query + " high quality -watermark");
        imageUrlsToTry.push(...ddgImages);
      } catch(e) {}
      
      let skipped = 0;
      for (let i = 0; i < imageUrlsToTry.length; i++) {
        const targetUrl = imageUrlsToTry[i];
        if (!targetUrl) continue;
        
        try {
          const fetchRes = await fetch(targetUrl, { 
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(3000)
          });
          if (fetchRes.ok) {
            const arrayBuffer = await fetchRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');
            const mimeType = fetchRes.headers.get('content-type') || 'image/jpeg';
            if (mimeType.startsWith('image/') || mimeType === 'application/octet-stream') {
              if (skipped < offset) {
                skipped++;
                continue;
              }
              const finalImage = `data:${mimeType === 'application/octet-stream' ? 'image/jpeg' : mimeType};base64,${base64}`;
              return res.json({ image: finalImage, nextOffset: offset + 1 });
            }
          }
        } catch (err) {}
      }
      return res.json({ image: null, nextOffset: offset });
    } catch(e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/enrich-insights", async (req, res) => {
    try {
      const { questions, enableInsightImages } = req.body;
      if (!questions || !Array.isArray(questions)) return res.json({ questions: [] });
      
      if (enableInsightImages === false) return res.json({ questions });
      const enrichedQuestions = await Promise.all(questions.map(async (q: any) => {
        if (q.insight && !q.insightImageUrl) {
            const queryToSearch = q.insightImageSearchQuery || `${req.body.topic ? req.body.topic + ' ' : ''}${q.correctAnswer || q.answer || ''}`.trim();
            const img = await fetchImageForQuery(queryToSearch);
            if (img) {
              q.insightImageUrl = img;
            }
          }
        return q;
      }));
      
      res.json({ questions: enrichedQuestions });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });


  
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

      
      let response;
      let retries = 3;
      const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-pro-preview", "gemini-3.1-flash-lite"];
      let currentModelIndex = 0;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
        model: modelsToTry[currentModelIndex],
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
                    insightImageSearchQuery: { type: Type.STRING, description: "A highly specific image search query to find a photo representing the correct answer. This MUST be based purely on the correct answer itself (e.g. 'Eiffel Tower', 'Golden Retriever') and NEVER contain the full insight sentence or trivia question text." },
        blurTechnique: { type: Type.STRING, description: "For blurred-image quizzes. Choose a blur style: 'heavy-blur', 'pixelated-blur', 'grayscale-blur', 'normal-blur', 'light-blur', 'invert-blur', 'sepia-blur', 'hue-rotate-blur', 'zoom-blur', 'high-contrast-blur'." },
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

                break; // Success, exit retry loop
        } catch (error: any) {
          console.error(`Presentation generation attempt failed with ${modelsToTry[currentModelIndex]}: ${JSON.stringify(error)}`);
          if (error.status === 429 || error.status === 404 || error?.message?.includes("429") || error?.message?.includes("404") || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.status === "RESOURCE_EXHAUSTED") {
            if (currentModelIndex < modelsToTry.length - 1) {
              currentModelIndex++;
              console.log(`Falling back to ${modelsToTry[currentModelIndex]}`);
              continue;
            }
          }
          retries--;
          if (retries === 0) {
            if (error.status === 429 || error.status === 404 || error?.message?.includes("429") || error?.message?.includes("404") || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.status === "RESOURCE_EXHAUSTED") {
              throw new Error("You have reached the AI generation rate limit across all available models. Please wait about a minute and try again.");
            }
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 seconds before retry
        }
      }

      const data = JSON.parse(response?.text || "{}");

      
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

      
      // Enrich insights for presentation
      if (req.body.enableInsightImages !== false && presentation.questions && Array.isArray(presentation.questions)) {
        presentation.questions = await Promise.all(presentation.questions.map(async (q: any) => {
          if (q.insight && !q.insightImageUrl) {
            const queryToSearch = q.insightImageSearchQuery || `${req.body.topic ? req.body.topic + ' ' : ''}${q.correctAnswer || q.answer || ''}`.trim();
            const img = await fetchImageForQuery(queryToSearch);
            if (img) {
              q.insightImageUrl = img;
            }
          }
          return q;
        }));
      }

      res.json(presentation);
    } catch (error: any) {
      console.error("Presentation generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate presentation." });
    }
  });

  app.post("/api/cache-json-images", async (req, res) => {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Invalid items array." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }
      
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });

      // 1. First use Gemini to generate the BEST image search queries for each item
      const prompt = `You are an expert at generating image search queries.
For each item in the following list, your task is to provide the BEST, highly specific Google Image Search query to find a visually stunning and highly relevant background image for the quiz question. 
If the question is an abstract concept (like a logic puzzle or math question) where an image would not be helpful, or if the question explicitly asks 'what is the name of this object' (meaning the image shouldn't be revealed beforehand), set the query to null. 
Ensure queries fetch EXACTLY the intended subject (e.g., 'Taj Mahal high resolution daytime' or 'Elephanta Caves exterior wide shot'). Avoid generic terms.

Items:
${JSON.stringify(items.map((i: any) => ({ id: i.id, question: i.question_text || i.brand_name || i.name, answer: i.brand_name || i.name })))}

Return a JSON array of objects, where each object has 'id' (matching the item) and 'query' (the highly specific image search query, or null if irrelevant).`;

      let searchQueries: any[] = [];
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  query: { type: Type.STRING, description: "Highly specific image search query, or null if no image is needed." }
                },
                required: ["id"]
              }
            }
          }
        });
        const text = response?.text;
        if (text) {
          searchQueries = JSON.parse(text);
        }
      } catch (e) {
        console.error("Failed to generate search queries:", e);
      }

      // 2. Map queries to items and fetch images
            const cachedItems = [];
      for (const item of items) {
        let imageUrlsToTry: string[] = [];
        
        if (item.image_url) {
          imageUrlsToTry.push(item.image_url);
        } else {
          // Find the generated query for this item
          const matchedQueryObj = searchQueries.find((sq: any) => sq.id == item.id);
          const query = matchedQueryObj?.query || item.brand_name || item.name;
          
          if (query && query !== 'null') {
            try {
              const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`, {
                headers: { "User-Agent": "aistudio-build/1.0 (vanjimohan@gmail.com)" }
              });
              if (!searchRes.ok) throw new Error(`Wikipedia search HTTP ${searchRes.status}`);
              
              const searchData = await searchRes.json();
              const title = searchData.query?.search?.[0]?.title;
              
              if (title) {
                const imgRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`, {
                  headers: { "User-Agent": "aistudio-build/1.0 (vanjimohan@gmail.com)" }
                });
                if (imgRes.ok) {
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
              }
            } catch (e) {
              console.error("Wikipedia search failed for", query, e);
            }
            
            // Fallback to Google Image Search if Wikipedia fails or we want more options
            if (imageUrlsToTry.length === 0) {
                            try {
              const ddgImages = await searchDuckDuckGoImages(query);
              imageUrlsToTry.push(...ddgImages);
            } catch (e) {
              console.error("Failed to fetch image for", query, e);
            }
            }
          }
        }

        // Try downloading one of the discovered URLs
        let fetchedSuccessfully = false;
        for (const targetUrl of imageUrlsToTry) {
           if (fetchedSuccessfully) break;
           try {
             const fetchRes = await fetch(targetUrl, { 
                headers: { "User-Agent": "Mozilla/5.0" },
                signal: AbortSignal.timeout(5000)
             });
             if (fetchRes.ok) {
               const arrayBuffer = await fetchRes.arrayBuffer();
               const buffer = Buffer.from(arrayBuffer);
               const base64 = buffer.toString('base64');
               const mimeType = fetchRes.headers.get('content-type') || 'image/jpeg';
               if (mimeType.startsWith('image/') || mimeType === 'application/octet-stream') {
                 item.image_base64 = `data:${mimeType === 'application/octet-stream' ? 'image/jpeg' : mimeType};base64,${base64}`;
                 item.image_url = targetUrl; // Save the successful URL
                 fetchedSuccessfully = true;
               }
             }
           } catch (e) {
             console.error("Failed to cache image from:", targetUrl, e);
           }
        }
        
        cachedItems.push(item);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      res.json({ items: cachedItems });
    } catch (error: any) {
      console.error("Cache images error:", error);
      res.status(500).json({ error: error.message || "Failed to cache images." });
    }
  });

  
  app.post("/api/fix-json", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "No text provided" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is required" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "The following text is a malformed JSON file. Fix it and return ONLY valid JSON without any markdown formatting. Text:\n" + text,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });
      
      let fixedText = response.text || "";
      
      const parsed = JSON.parse(fixedText);
      res.json(parsed);
    } catch (error) {
      console.error("Error fixing JSON:", error);
      res.status(500).json({ error: "Failed to fix JSON" });
    }
  });

  app.post("/api/generate-quiz", async (req, res) => {
    try {
      let { topic, numQuestions, difficulty, quizType = 'multiple-choice', customItems, identifyMultiChoice = true, includeImages = false, themeMemoryBreak = false } = req.body;
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
      if ((quizType === 'identify-image' || quizType === 'blurred-image')) {
        targetNumQuestions = numQuestions + 5; // Generate extra questions in case image fetching fails
      }
      let contents = `Generate a kids quiz about "${topic}". The difficulty should be ${difficulty}. Generate ${targetNumQuestions} questions.`;
      if (customItems && customItems.length > 0) {
        if ((quizType === 'identify-image' || quizType === 'blurred-image')) {
          if (identifyMultiChoice) {
            contents = `This is an 'Identify the Image' round based on custom items. There are ${customItems.length} items. Generate exactly 1 question for each item. For each item: - The 'id' MUST exactly match the provided item id. - The 'question' should be 'Identify this ${topic === 'Item' ? 'Item' : topic}'. - The 'correctAnswer' MUST exactly match the provided item name. - Generate 3 plausible but incorrect options. If the items share a common category, use that category for the incorrect options. The final 'options' array must contain the correct answer and the 3 incorrect options, shuffled. - 'timeLimit' should be 10 seconds. Here are the items: ${JSON.stringify(customItems)}`;
          } else {
            contents = `This is an 'Identify the Image' round based on custom items. There are ${customItems.length} items. Generate exactly 1 question for each item. For each item: - The 'id' MUST exactly match the provided item id. - The 'question' should be 'Identify this ${topic === 'Item' ? 'Item' : topic}'. - The 'correctAnswer' MUST exactly match the provided item name. DO NOT generate options. - 'timeLimit' should be 10 seconds. Here are the items: ${JSON.stringify(customItems)}`;
          }
        } else {
          contents = `This is a multiple choice quiz based on custom items. There are ${customItems.length} items. Generate exactly 1 question for each item. For each item: - The 'id' MUST exactly match the provided item id. - Create an engaging question about the item (whose name is provided). - The 'correctAnswer' MUST exactly match the provided item name. - Generate 3 plausible but incorrect options. The final 'options' array must contain the correct answer and the 3 incorrect options, shuffled. - 'timeLimit' should be 10 seconds. Here are the items: ${JSON.stringify(customItems)}`;
        }
      }
      
      let questionSchemaProps: any = {
        question: { type: Type.STRING, description: "The quiz question text. CRITICAL: If the quiz is to identify a movie/show, DO NOT mention the movie/show name in the question text." },
        correctAnswer: { type: Type.STRING, description: "The exact correct answer string." },
        timeLimit: { type: Type.NUMBER, description: "Time limit in seconds (usually 10, but use 20 for find-in-map rounds)." },
        imageSearchQuery: { type: Type.STRING, description: "If the quiz involves images, provide a highly specific Google Image Search query to fetch an accurate image. CRITICAL: Ensure the query fetches exactly the intended subject. Use highly specific terms (e.g., '2023 Ford Mustang car side view' not 'Mustang', 'Golden Retriever dog' not 'Dog'). Avoid generic terms that return unrelated images. CRITICAL RULE FOR MOVIES/TV SHOWS: You ABSOLUTELY MUST NOT search for the movie/show's poster. Instead, search for a lead actor portrait or a general object." },
        insight: { type: Type.STRING, description: "A fun 'Did you know?' fact related to the correct answer. Keep it very short (1 sentence)." },
        insightImageSearchQuery: { type: Type.STRING, description: "A highly specific image search query to find a photo representing the correct answer. This MUST be based purely on the correct answer itself (e.g. 'Eiffel Tower', 'Golden Retriever') and NEVER contain the full insight sentence or trivia question text." }
      };
      if (customItems && customItems.length > 0) { questionSchemaProps.id = { type: Type.STRING, description: "The exact ID of the item" }; }
      let requiredQuestionProps = ["question", "correctAnswer", "timeLimit"];
      if (customItems && customItems.length > 0) { requiredQuestionProps.push("id"); }

      if (quizType !== 'detective' && quizType !== 'jumbled-letters' && quizType !== 'match-the-following' && quizType !== 'combat-mode' && quizType !== 'identify-image' && quizType !== 'blurred-image' && quizType !== 'a-to-z') {
        requiredQuestionProps.push("options");
        questionSchemaProps.options = {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "4 multiple choice options."
        };
      } else if ((quizType === 'identify-image' || quizType === 'blurred-image')) {
        if (identifyMultiChoice) {
          requiredQuestionProps.push("options");
          questionSchemaProps.options = {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "4 multiple choice options."
          };
        }
      }

      if ((quizType === 'identify-image' || quizType === 'blurred-image')) {
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
        contents += ` This is a 'Word Search' round. For each question, provide a list of exactly 3 words related to the theme in 'wordsToFind'. Each word MUST be a maximum of 6 characters long, uppercase, with no spaces. CRITICAL: DOUBLE CHECK THE SPELLING of every word to ensure it is a correct and valid English word. The 'question' field should just be 'Find the 3 hidden words!'. The 'correctAnswer' should be 'Words found!'.`;
        questionSchemaProps.wordsToFind = {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Exactly 5 words, max 6 chars each, uppercase, no spaces."
        };
        requiredQuestionProps.push("wordsToFind");
      } else if (quizType === 'mega-quiz') {
        contents += ` This is a Mega Quiz. Generate a wide mix of questions from all possible categories (history, science, geography, pop culture, sports, arts, literature, movies, logic, etc). For each question, provide 4 options. Ensure the questions are diverse and fun.`;
      } else if (quizType === 'a-to-z') {
        contents += ` This is an 'A to Z Challenge' round. Generate exactly 26 questions, one for each letter of the English alphabet from A to Z, in alphabetical order. For each question, the correct answer MUST start with that specific letter and be strongly related to the theme '${topic}'. The correct answer can be a single word or a short phrase (up to 5 words maximum), as long as the first word starts with the required letter. The 'question' should literally be: 'Name a ${topic} starting with the letter [Letter]'. Provide an interesting 'insight' and an 'imageSearchQuery' (if includeImages is true) for the correct answer. Do NOT provide multiple choice options.`;
        if (includeImages) {
          contents += ` CRITICAL: Provide an 'imageSearchQuery' to fetch a highly specific, high-quality photo that relates to the correct answer. Add terms like "-watermark -stock", "high quality", "clear photo", or "isolated" to ensure good results.`;
        }
      } else if (quizType === 'rapid-fire') {
        contents += ` This is a 'Rapid Fire' round. Provide short, snappy questions and 4 options each. The questions should be quick to read and answer.`;
      } else {
        contents += ` This is a multiple choice quiz. For each question, provide 4 options.`;
        if (includeImages) {
          contents += ` CRITICAL: Provide an 'imageSearchQuery' to fetch a highly specific, high-quality photo that relates to the correct answer. Add terms like "-watermark -stock", "high quality", "clear photo", or "isolated" to ensure good results.`;
        }
      }

      let response;
      let retries = 3;
      const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-pro-preview", "gemini-3.1-flash-lite"];
      let currentModelIndex = 0;

      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: modelsToTry[currentModelIndex],
            contents,
            config: {
              responseMimeType: "application/json",
              responseSchema: (() => {
                const props: any = {
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
            },
          });
          break; // Success, exit retry loop
        } catch (error: any) {
          console.error(`Attempt failed with ${modelsToTry[currentModelIndex]}: ${JSON.stringify(error)}`);
          if (error.status === 429 || error.status === 404 || error?.message?.includes("429") || error?.message?.includes("404") || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.status === "RESOURCE_EXHAUSTED") {
            if (currentModelIndex < modelsToTry.length - 1) {
              currentModelIndex++;
              console.log(`Falling back to ${modelsToTry[currentModelIndex]}`);
              continue;
            }
          }
          retries--;
          if (retries === 0) {
            if (error.status === 429 || error.status === 404 || error?.message?.includes("429") || error?.message?.includes("404") || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.status === "RESOURCE_EXHAUSTED") {
              throw new Error("You have reached the AI generation rate limit across all available models. Please wait about a minute and try again.");
            }
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 seconds before retry
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

      if ((!customItems || customItems.length === 0) && (topic.toLowerCase().startsWith("identify") || (quizType === 'identify-image' || quizType === 'blurred-image') || includeImages)) {
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
              const ddgImages = await searchDuckDuckGoImages(q.imageSearchQuery);
              imageUrlsToTry.push(...ddgImages);
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
        
        if ((quizType === 'identify-image' || quizType === 'blurred-image') || topic.toLowerCase().startsWith("identify")) {
          quizData.questions = quizData.questions.filter(q => q.imageUrl);
          if (quizData.questions.length === 0) {
            return res.status(500).json({ error: "Failed to fetch accurate images for the requested topic. Please try a different topic or less obscure subjects." });
          }
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

      
      // Enrich insights before returning
      if (req.body.enableInsightImages !== false && quizData.questions && Array.isArray(quizData.questions)) {
        quizData.questions = await Promise.all(quizData.questions.map(async (q: any) => {
          if (q.insight && !q.insightImageUrl) {
            const queryToSearch = q.insightImageSearchQuery || `${req.body.topic ? req.body.topic + ' ' : ''}${q.correctAnswer || q.answer || ''}`.trim();
            const img = await fetchImageForQuery(queryToSearch);
            if (img) {
              q.insightImageUrl = img;
            }
          }
          return q;
        }));
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
