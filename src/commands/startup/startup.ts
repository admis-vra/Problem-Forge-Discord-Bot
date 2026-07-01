import { createAiCommand } from "../ai/ai-command.factory.js";

export default createAiCommand({
  name: "startup",
  description: "Get startup strategy help",
  category: "startup",
  promptLabel: "Startup idea or problem",
  system: "Act as a startup advisor. Give market framing, MVP scope, risks, pricing thoughts, and a concrete next-step plan."
});
