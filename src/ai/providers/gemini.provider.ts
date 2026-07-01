import { env } from "../../config/env.js";
import type { AIProvider, AITextRequest, AITextResponse } from "./types.js";

export class GeminiProvider implements AIProvider {
  id = "gemini";
  displayName = "Gemini";
  models = ["gemini-flash", "gemini-pro", "gemini-2.5-flash", "gemini-2.5-pro"];

  isConfigured() {
    return Boolean(env.GEMINI_API_KEY);
  }

  async generateText(request: AITextRequest): Promise<AITextResponse> {
    if (!this.isConfigured()) {
      return {
        content: "Gemini is not configured yet. Add GEMINI_API_KEY to enable live AI responses.",
        model: request.model,
        provider: this.id
      };
    }

    const prompt = request.messages.map((message) => `${message.role}: ${message.content}`).join("\n\n");
    const modelId = request.model === "gemini-pro" ? "gemini-2.5-pro" : request.model === "gemini-flash" ? "gemini-2.5-flash" : request.model;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: request.temperature ?? 0.7 }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response generated.",
      model: request.model,
      provider: this.id
    };
  }
}
