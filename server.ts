
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import fs from "fs";

// Rate limiting state
let requestCount = 0;
let windowStart = Date.now();
const MAX_REQUESTS_PER_MINUTE = 10;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      hasKey: !!process.env.GEMINI_API_KEY 
    });
  });

  // API route
  app.post("/api/generate", async (req, res) => {
    console.log("POST /api/generate received");
    
    // Rate limiting
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
      if (!req.body) {
        return res.status(400).json({ error: "Request body is missing." });
      }

      const { message, history, systemInstruction, stream: shouldStream } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY is missing from environment");
        return res.status(500).json({ error: "Gemini API key is not configured on the server. Please ensure GEMINI_API_KEY is set in the environment variables." });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      if (shouldStream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

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
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve("dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("App not built. Please run npm run build.");
      }
    });
  }

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Global Error Handler:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
