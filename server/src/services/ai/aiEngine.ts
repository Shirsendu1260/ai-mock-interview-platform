import { GoogleGenAI } from '@google/genai';

const geminiApiKey = process.env.GEMINI_API_KEY!;

// Create a reusable Gemini client
// Every AI request will use this same instance
const gemini = new GoogleGenAI({
    apiKey: geminiApiKey
});

export { gemini };
