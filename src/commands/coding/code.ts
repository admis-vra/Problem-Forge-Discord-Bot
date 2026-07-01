import { createAiCommand } from "../ai/ai-command.factory.js";

export default createAiCommand({
  name: "code",
  description: "Generate code with explanation",
  category: "coding",
  promptLabel: "Coding task",
  system: "You are ForgeBot Coding Studio. Produce correct, secure code with syntax-highlighted Markdown fences, explain tradeoffs briefly, and call out assumptions."
});
