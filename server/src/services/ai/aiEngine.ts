import { GoogleGenAI } from '@google/genai';
import { ApiError } from '../../utils/ApiError.js';

const geminiApiKey = process.env.GEMINI_API_KEY;

if(!geminiApiKey) {
    throw new ApiError(500, 'GEMINI_API_KEY is missing.');
}

// Create a reusable Gemini client
// Every AI request will use this same instance
const gemini = new GoogleGenAI({
    apiKey: geminiApiKey
});

export { gemini };
