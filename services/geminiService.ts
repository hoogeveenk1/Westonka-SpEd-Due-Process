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

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      throw new Error(typeof data?.error === "string" ? data.error : `API request failed (${resp.status})`);
    }
    return data.text as string;
  }

  async *sendMessageStream(message: string, history: HistoryMessage[] = []) {
    // For now, just yield the full response once.
    // (True streaming would require SSE or a streaming response from /api/generate.)
    const text = await this.sendMessage(message, history);
    yield text;
  }
}

export const geminiService = new GeminiService();
