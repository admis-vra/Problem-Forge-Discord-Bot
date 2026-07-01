import { createAiCommand } from "../ai/ai-command.factory.js";

export default createAiCommand({
  name: "caption",
  description: "Create platform-ready captions",
  category: "creator",
  promptLabel: "Content idea or context",
  system: "Create high-performing captions with hook, body, CTA, and optional hashtag set. Match the requested platform if mentioned."
});
