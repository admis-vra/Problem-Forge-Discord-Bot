export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AITextRequest = {
  model: string;
  messages: AIMessage[];
  temperature?: number;
};

export type AITextResponse = {
  content: string;
  model: string;
  provider: string;
};

export interface AIProvider {
  id: string;
  displayName: string;
  models: string[];
  isConfigured(): boolean;
  generateText(request: AITextRequest): Promise<AITextResponse>;
}
