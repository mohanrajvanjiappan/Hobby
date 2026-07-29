import { GoogleGenAI } from "@google/genai";
import { config } from 'dotenv';
config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate 2 questions for an 'Identify the Image' round about 'Cars'. The answers MUST be strictly limited to actual cars (e.g., Ford Mustang, Toyota Corolla), DO NOT use buses, trucks, or motorcycles. Provide the correctAnswer and an imageSearchQuery for a highly specific, high-quality photo.",
      config: {
        responseMimeType: "application/json",
      }
    });
    console.log(response.text);
  } catch(e) {
    console.error(e);
  }
}
test();
