
import { GoogleGenAI } from "@google/genai";

let requestCount = 0;
let windowStart = Date.now();
const MAX_REQUESTS_PER_MINUTE = 10;

export async function handleGenerate(req: any, res: any) {
  const now = Date.now();

  if (now - windowStart > 60000) {
    windowStart = now;
    requestCount = 0;
  }

  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ error: "Please wait a moment before sending another request." });
  }

  requestCount++;

  try {
    const { message, history, systemInstruction, stream: shouldStream } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment");
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }
    const ai = new GoogleGenAI({ apiKey });
    
    if (shouldStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      for await (const chunk of stream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });
      res.json({ text: response.text });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || "Internal Server Error" })}\n\n`);
      res.end();
    }
  }
}
