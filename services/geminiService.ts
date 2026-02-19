import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: any;

  constructor() {
    // Access the API key from the environment. 
    // Vite will inject this via the 'define' config or import.meta.env
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) 
      ? import.meta.env.VITE_GEMINI_API_KEY
      git add .
      git commit -m "Fix Gemini env variable for Vite"
    git push
      : '';
      
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  async sendMessage(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async* sendMessageStream(message: string, history: any[] = []) {
    try {
        const stream = await this.ai.models.generateContentStream({
            model: 'gemini-3-flash-preview',
            contents: [
                ...history,
                { role: 'user', parts: [{ text: message }] }
            ],
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
            }
        });

        for await (const chunk of stream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Gemini Streaming Error:", error);
        throw error;
    }
  }
}

export const geminiService = new GeminiService();
