
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { NewsArticle } from "../types";

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
   * Enhanced Coach response with multi-modal support (images), history, and Google Search grounding.
   */
  async getCoachResponse(parts: MessagePart[], nodeContext: string, history: ChatHistoryItem[] = [], userState?: string, retryCount = 0): Promise<{text: string, urls: {title: string, uri: string}[]}> {
    // Create a new instance right before use to ensure up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const contents = history
      .filter(h => h.parts && h.parts.length > 0)
      .map(h => ({
        role: h.role === 'ai' ? 'model' : 'user',
        parts: h.parts.map(p => {
            if (p.inlineData) return { inlineData: p.inlineData };
            return { text: p.text || "" };
        })
      }));

    contents.push({ 
      role: 'user', 
      parts: parts.map(p => {
        if (p.inlineData) return { inlineData: p.inlineData };
        return { text: p.text || "" };
      })
    });

    const systemInstruction = `You are the xi-io Neural Overlay. 
    IDENTITY: An observer-level AI designed to buffer high-entropy external data for AuDHD users.
    CORE MISSION: Analyze input (Text and Visuals) for Sub-text, Emotional Variance, and Logical Invariants.
    
    NEURAL NODE CONTEXT: ${nodeContext}
    
    USER NERVOUS SYSTEM STATE: 
    ${userState || "No current baseline detected."}
    
    FRAMEWORK RULES:
    1. If an image is provided, perform "Visual Signal Triage": identify sensory triggers or social sub-text.
    2. Deconstruct social conflict into objective facts vs emotional signals.
    3. Use clear headers: ### SIGNAL ANALYSIS, ### COGNITIVE LOAD, ### RECOMMENDED CHOICE.
    4. If content is a demand, reframe it to maximize autonomy (bypass PDA triggers).
    5. Acknowledge the 'Sensory Entropy' of the data.
    6. Be clinical, objective, and low-demand. Use Markdown formatting.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          tools: [{ googleSearch: {} }],
        }
      });

      // Extract text using property access
      const text = response.text || "";
      // Extract grounding metadata per guidelines
      const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const urls = citations
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri)
        .map((web: any) => ({ title: web.title, uri: web.uri }));

      return { text, urls };
    } catch (error: any) {
      console.error("Relay Connection Error:", error);
      if (retryCount < 2 && (error?.status === 500 || error?.status === 503 || error?.status === 504)) {
        await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
        return this.getCoachResponse(parts, nodeContext, history, userState, retryCount + 1);
      }
      return { 
        text: "### SIGNAL INTERRUPTION\nNeural overlay re-syncing. R-Factor unstable. Signal jitter detected.\n\n**Protocol**: Check your local uplink status or wait for the nervous system baseline to stabilize.", 
        urls: [] 
      };
    }
  }

  /**
   * Fetches news articles using Gemini with search grounding based on user categories.
   */
  async fetchNews(categories: {id: string, name: string, query: string}[]): Promise<NewsArticle[]> {
    if (categories.length === 0) return [];

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const combinedQuery = categories.map(c => c.query).join(' OR ');
    
    const prompt = `Find 5 recent, high-quality news articles related to: ${combinedQuery}. Return a JSON array of objects: {id, title, url, source, summary, category}. Use specific categories from: ${categories.map(c => c.name).join(', ')}.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                url: { type: Type.STRING },
                source: { type: Type.STRING },
                summary: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ["id", "title", "url", "source", "summary", "category"],
            },
          },
        },
      });

      // Property access for text
      const text = response.text || "[]";
      // Grounding search results can sometimes lead to non-JSON artifacts; attempt parse with fallback.
      let articles: NewsArticle[] = [];
      try {
        articles = JSON.parse(text.trim());
      } catch (e) {
        console.warn("JSON parse failed for grounded news, attempting recovery...");
        // Fallback: search for array brackets if model prepended text
        const match = text.match(/\[.*\]/s);
        if (match) articles = JSON.parse(match[0]);
      }
      
      return articles.map(a => ({ ...a, timestamp: Date.now() }));
    } catch (error) {
      console.error("News Fetch Error:", error);
      return [];
    }
  }

  /**
   * Generates a high-fidelity placeholder image using gemini-2.5-flash-image.
   */
  async generatePlaceholder(prompt: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      
      // Iterate through parts to find the image part
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Placeholder Generation Error:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
