import { env } from "../config/env.js";
import { prisma } from "../database/prisma.js";
import { logger } from "../utils/logger.js";

const cleanupIntervalMs = 60 * 60 * 1000;

export async function cleanupOldConversationHistory() {
  const cutoff = new Date(Date.now() - env.CONVERSATION_RETENTION_HOURS * 60 * 60 * 1000);

  const deletedMessages = await prisma.conversationMessage.deleteMany({
    where: {
      createdAt: {
        lt: cutoff
      }
    }
  });

  const emptyConversations = await prisma.conversation.findMany({
    where: {
      messages: {
        none: {}
      }
    },
    select: {
      id: true
    },
    take: 500
  });

  if (emptyConversations.length > 0) {
    await prisma.conversation.deleteMany({
      where: {
        id: {
          in: emptyConversations.map((conversation) => conversation.id)
        }
      }
    });
  }

  logger.info(
    {
      deletedMessages: deletedMessages.count,
      deletedConversations: emptyConversations.length,
      retentionHours: env.CONVERSATION_RETENTION_HOURS
    },
    "Cleaned old conversation history"
  );
}

export function startCleanupJob() {
  void cleanupOldConversationHistory().catch((error) => logger.error({ error }, "Initial conversation cleanup failed"));

  return setInterval(() => {
    void cleanupOldConversationHistory().catch((error) => logger.error({ error }, "Scheduled conversation cleanup failed"));
  }, cleanupIntervalMs);
}
