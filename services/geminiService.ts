import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export interface MessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface ChatHistoryItem {
  role: 'user' | 'ai';
  parts: MessagePart[];
}

export class GeminiService {
  /**
   * Local heuristics for immediate feedback
   */
  getLocalReframing(query: string): string | null {
    const q = query.toLowerCase();
    if (q.includes('overwhelmed') || q.includes('meltdown')) return "LOCAL BUFFER: High-noise state detected. Recommended: Sensory isolation and zero verbal demands.";
    if (q.includes('stuck') || q.includes('pda')) return "PDA ADVISORY: Autonomy threat detected. Reframe: You are choosing this action to stabilize your future self.";
    return null;
  }

  /**
   * Enhanced Coach response with multi-modal support, history, and Google Search grounding.
   */
  async getCoachResponse(parts: MessagePart[], context: string, history: ChatHistoryItem[] = []) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const local = parts[0]?.text ? this.getLocalReframing(parts[0].text) : null;

    // Map history to Gemini's format (user/model roles)
    const contents = history.map(h => ({
      role: h.role === 'ai' ? 'model' : 'user',
      parts: h.parts
    }));

    // Add current message
    contents.push({ role: 'user', parts });

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents,
        config: {
          systemInstruction: `You are the xi-io AuDHD Chat Coach. Use Spoon Theory and PDA reframing. NEVER use deficit-based language. Structure your responses with headers and lists for high readability. Current stability context: ${context}. Keep your persona consistent across the conversation.`,
          temperature: 0.7,
          tools: [{ googleSearch: {} }],
        }
      });

      const text = response.text || "";
      const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const urls = citations
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri)
        .map((web: any) => ({ title: web.title, uri: web.uri }));

      return { 
        text: local ? `${local}\n\n${text}` : text,
        urls 
      };
    } catch (error) {
      console.error("Coach Service Error:", error);
      return { 
        text: local || "Signal interruption. The neural relay is currently offline.", 
        urls: [] 
      };
    }
  }
}

export const geminiService = new GeminiService();