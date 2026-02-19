import { SYSTEM_INSTRUCTION } from "../constants";

type HistoryMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

export class GeminiService {
  async sendMessage(message: string, history: HistoryMessage[] = []) {
    const resp = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history,
        systemInstruction: SYSTEM_INSTRUCTION,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.error || "API request failed");
    return data.text as string;
  }

  async *sendMessageStream(message: string, history: HistoryMessage[] = []) {
    // Simple non-streaming fallback (streaming needs a different server setup)
    const text = await this.sendMessage(message, history);
    yield text;
  }
}

export const geminiService = new GeminiService();
