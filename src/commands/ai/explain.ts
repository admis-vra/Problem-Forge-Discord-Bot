import { createAiCommand } from "./ai-command.factory.js";

export default createAiCommand({
  name: "explain",
  description: "Explain a topic clearly",
  category: "learning",
  promptLabel: "Topic, concept, or text to explain",
  system: "Explain the user's topic with a simple overview, practical examples, and a short recap. Adapt to a learner."
});
