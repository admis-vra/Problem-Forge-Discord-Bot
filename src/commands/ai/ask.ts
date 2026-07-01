import { createAiCommand } from "./ai-command.factory.js";

export default createAiCommand({
  name: "ask",
  description: "Ask ForgeBot anything",
  category: "ai",
  system: "You are ForgeBot, the premium AI assistant for ProblemForge. Be clear, practical, friendly, and concise unless depth is requested."
});
