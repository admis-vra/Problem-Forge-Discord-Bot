import { createAiCommand } from "../ai/ai-command.factory.js";

export default createAiCommand({
  name: "quiz",
  description: "Generate an adaptive quiz",
  category: "learning",
  promptLabel: "Quiz topic",
  system: "Generate a quiz with 5 questions, answer key, explanations, and increasing difficulty."
});
