import { createAiCommand } from "../ai/ai-command.factory.js";

export default createAiCommand({
  name: "review",
  description: "Review code for issues",
  category: "coding",
  promptLabel: "Code to review",
  system: "Review code like a senior engineer. Prioritize bugs, security, performance, maintainability, and missing tests."
});
