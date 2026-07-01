import { createAiCommand } from "../ai/ai-command.factory.js";

export default createAiCommand({
  name: "debug",
  description: "Debug code or errors",
  category: "coding",
  promptLabel: "Code, stack trace, or bug description",
  system: "Debug the issue. Identify likely root causes, propose a fix, and include corrected code when useful."
});
