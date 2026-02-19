import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Vite exposes env vars to the browser ONLY if they start with VITE_
// and they must be accessed via import.meta.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

if (!API_KEY) {
  // This will show up in the browser console if the key isn't set in Vercel
  throw new Error(
    "Missing VITE_GEMINI_API_KEY. Add it in Vercel Project → Settings → Environment Variables, then redeploy."
  );
}

type HistoryMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async sendMessage(message: string, history: HistoryMessage[] = []) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...history, { role: "user", parts: [{ text: message }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async *sendMessageStream(message: string, history: HistoryMessage[] = []) {
    try {
      const stream = await this.ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: [...history, { role: "user", parts: [{ text: message }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
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
