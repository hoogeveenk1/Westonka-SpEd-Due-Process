
import { GoogleGenAI } from "@google/genai";

// Rate limiting state
let requestCount = 0;
let windowStart = Date.now();
const MAX_REQUESTS_PER_MINUTE = 100; // Increased for better UX

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const now = Date.now();
  if (now - windowStart > 60000) {
    windowStart = now;
    requestCount = 0;
  }

  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    console.warn("Rate limit exceeded");
    return res.status(429).json({ error: "Rate limit exceeded. Please wait a moment." });
  }
  requestCount++;

  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing." });
    }

    const { message, history, systemInstruction, stream: shouldStream } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment");
      return res.status(500).json({ error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables." });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Retry logic for 503/504 errors
    const MAX_RETRIES = 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (shouldStream) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for SSE

          const stream = await ai.models.generateContentStream({
            model: 'gemini-3-flash-preview',
            contents: [
              ...(history || []),
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
          return; // Success
        } else {
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
              ...(history || []),
              { role: 'user', parts: [{ text: message }] }
            ],
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            }
          });
          res.json({ text: response.text });
          return; // Success
        }
      } catch (error: any) {
        lastError = error;
        const isRetryable = error.message?.includes("503") || error.message?.includes("504") || error.message?.includes("high demand");
        
        if (isRetryable && attempt < MAX_RETRIES) {
          console.warn(`Gemini 503/504 detected. Retrying attempt ${attempt + 1}...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
          continue;
        }
        throw error; // Not retryable or max retries reached
      }
    }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      let errorMessage = error.message || "Internal Server Error";
      
      // Provide more actionable error for invalid API keys
      if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key not valid")) {
        errorMessage = "The Gemini API key provided is invalid. Please check your GEMINI_API_KEY environment variable.";
      }

      // Handle 503 High Demand
      if (errorMessage.includes("503") || errorMessage.includes("high demand")) {
        errorMessage = "Google's AI servers are currently experiencing high demand. I tried to reconnect but couldn't get through. Please wait 10-20 seconds and try your message again.";
      }
      
      const errorPayload = { 
        error: errorMessage,
        type: error.constructor.name
      };
      
      if (!res.headersSent) {
        res.status(500).json(errorPayload);
      } else {
        res.write(`data: ${JSON.stringify(errorPayload)}\n\n`);
        res.end();
      }
    }
}
