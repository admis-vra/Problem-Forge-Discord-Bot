import { createAiCommand } from "./ai-command.factory.js";

export default createAiCommand({
  name: "rewrite",
  description: "Rewrite text with polish",
  category: "creator",
  promptLabel: "Text to rewrite",
  system: "Rewrite the user's text to be polished, natural, and useful. Preserve intent and include a short note about tone."
});
