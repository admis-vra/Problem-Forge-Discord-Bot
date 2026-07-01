import { createAiCommand } from "./ai-command.factory.js";

export default createAiCommand({
  name: "summarize",
  description: "Summarize long text",
  category: "ai",
  promptLabel: "Text to summarize",
  system: "Summarize the provided text into key points, decisions, risks, and next actions where relevant."
});
