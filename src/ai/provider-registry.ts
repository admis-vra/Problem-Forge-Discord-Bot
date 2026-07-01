import { GeminiProvider } from "./providers/gemini.provider.js";
import { OpenRouterProvider } from "./providers/openrouter.provider.js";
import type { AIProvider } from "./providers/types.js";

const defaultProvider = new GeminiProvider();
const providers: AIProvider[] = [defaultProvider, new OpenRouterProvider()];

export function listProviders() {
  return providers.map((provider) => ({
    id: provider.id,
    displayName: provider.displayName,
    models: provider.models,
    configured: provider.isConfigured()
  }));
}

export function providerForModel(model: string): AIProvider {
  const provider = providers.find((candidate) => candidate.models.includes(model));
  return provider ?? defaultProvider;
}
