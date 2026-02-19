import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing GEMINI_API_KEY in Vercel env vars" });
    return;
  }

  try {
    const { message, history, systemInstruction } = req.body || {};
    if (!message) {
      res.status(400).json({ error: "Missing message" });
      return;
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

    res.status(200).json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini server error:", err);
    res.status(500).json({ error: err?.message || "Gemini request failed" });
  }
}
