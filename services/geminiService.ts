
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  async sendMessage(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, systemInstruction: SYSTEM_INSTRUCTION })
      });

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const text = await response.text();
          try {
            const error = JSON.parse(text);
            errorMessage = error.error || errorMessage;
          } catch (e) {
            if (text && text.length < 200) errorMessage = text;
          }
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.text;
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error("Network error detected. This could be a timeout, CORS issue, or the server closing the connection prematurely.");
      }
      throw error;
    }
  }

  async* sendMessageStream(message: string, history: any[] = []) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, systemInstruction: SYSTEM_INSTRUCTION, stream: true })
      });

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const text = await response.text();
          try {
            const error = JSON.parse(text);
            errorMessage = error.error || errorMessage;
          } catch (e) {
            if (text && text.length < 200) errorMessage = text;
          }
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) yield parsed.text;
            } catch (e) {
              console.error('Error parsing stream line:', e);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Gemini Streaming Error:", error);
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error("Network error detected. This could be a timeout, CORS issue, or the server closing the connection prematurely.");
      }
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
