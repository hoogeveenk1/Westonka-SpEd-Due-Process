import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    return res.json({ error: "Missing GEMINI_API_KEY on server (set in Vercel)" });
  }

  try {
    const { message, history, systemInstruction } = req.body || {};
    if (!message) {
      res.statusCode = 400;
      return res.json({ error: "Missing message" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...(history ?? []), { role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.statusCode = 200;
    return res.json({ text: response.text });
  } catch (err: any) {
    console.error("Server Gemini Error:", err);
    res.statusCode = 500;
    return res.json({ error: err?.message || "Gemini request failed" });
  }
}
