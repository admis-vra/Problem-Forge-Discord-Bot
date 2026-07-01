import { PremiumTier, Prisma, UsageType } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../database/prisma.js";

function isNewUtcDay(date: Date) {
  const now = new Date();
  return date.getUTCFullYear() !== now.getUTCFullYear() || date.getUTCMonth() !== now.getUTCMonth() || date.getUTCDate() !== now.getUTCDate();
}

export async function assertUsageAllowed(userId: string, type: UsageType) {
  const user = await prisma.userProfile.findUniqueOrThrow({ where: { id: userId } });

  if (isNewUtcDay(user.usageResetAt)) {
    await prisma.userProfile.update({
      where: { id: userId },
      data: { aiUsageToday: 0, imageUsageToday: 0, usageResetAt: new Date() }
    });
    user.aiUsageToday = 0;
    user.imageUsageToday = 0;
  }

  if (user.premiumTier !== PremiumTier.FREE) return;

  if (type === UsageType.AI_CHAT && user.aiUsageToday >= env.FREE_AI_REQUESTS_PER_DAY) {
    throw new Error(`Daily free AI limit reached (${env.FREE_AI_REQUESTS_PER_DAY}).`);
  }

  if (type === UsageType.IMAGE && user.imageUsageToday >= env.FREE_IMAGE_REQUESTS_PER_DAY) {
    throw new Error(`Daily free image limit reached (${env.FREE_IMAGE_REQUESTS_PER_DAY}).`);
  }
}

export async function recordUsage(userId: string, type: UsageType, metadata?: Prisma.InputJsonValue) {
  await prisma.usageEvent.create({ data: { userId, type, metadata } });

  if (type === UsageType.AI_CHAT) {
    await prisma.userProfile.update({ where: { id: userId }, data: { aiUsageToday: { increment: 1 } } });
  }

  if (type === UsageType.IMAGE) {
    await prisma.userProfile.update({ where: { id: userId }, data: { imageUsageToday: { increment: 1 } } });
  }
}
