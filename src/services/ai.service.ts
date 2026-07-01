import { UsageType } from "@prisma/client";
import { prisma } from "../database/prisma.js";
import { providerForModel } from "../ai/provider-registry.js";
import type { AIMessage } from "../ai/providers/types.js";
import { assertUsageAllowed, recordUsage } from "./usage.service.js";
import { awardXp } from "./xp.service.js";

export async function runAiPrompt(params: {
  userId: string;
  channelId: string;
  model: string;
  system: string;
  prompt: string;
  title: string;
}) {
  await assertUsageAllowed(params.userId, UsageType.AI_CHAT);

  const conversation = await prisma.conversation.create({
    data: { userId: params.userId, channelId: params.channelId, title: params.title }
  });

  const messages: AIMessage[] = [
    { role: "system", content: params.system },
    { role: "user", content: params.prompt }
  ];

  const provider = providerForModel(params.model);
  const result = await provider.generateText({ model: params.model, messages });

  await prisma.conversationMessage.createMany({
    data: [
      { conversationId: conversation.id, role: "user", content: params.prompt, model: params.model },
      { conversationId: conversation.id, role: "assistant", content: result.content, model: result.model }
    ]
  });

  await recordUsage(params.userId, UsageType.AI_CHAT, { model: result.model, provider: result.provider });
  await awardXp(params.userId, 15, "ai_prompt");

  return result;
}
