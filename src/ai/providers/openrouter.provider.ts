import { env } from "../../config/env.js";
import type { AIProvider, AITextRequest, AITextResponse } from "./types.js";

export class OpenRouterProvider implements AIProvider {
  id = "openrouter";
  displayName = "OpenRouter";
  models = ["qwen/qwen-2.5-coder-32b-instruct", "mistralai/mistral-small", "meta-llama/llama-3.1-8b-instruct"];

  isConfigured() {
    return Boolean(env.OPENROUTER_API_KEY);
  }

  async generateText(request: AITextRequest): Promise<AITextResponse> {
    if (!this.isConfigured()) {
      return {
        content: "OpenRouter is not configured yet. Add OPENROUTER_API_KEY to enable this provider.",
        model: request.model,
        provider: this.id
      };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://problemforge.ai",
        "X-Title": "ProblemForge AI"
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return {
      content: data.choices?.[0]?.message?.content ?? "No response generated.",
      model: request.model,
      provider: this.id
    };
  }
}
