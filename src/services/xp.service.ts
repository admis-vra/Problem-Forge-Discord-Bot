import { prisma } from "../database/prisma.js";

const levelThreshold = (level: number) => Math.floor(100 * Math.pow(level, 1.35));

export function titleForLevel(level: number) {
  if (level >= 90) return "Legend";
  if (level >= 75) return "Forge Master";
  if (level >= 60) return "Visionary";
  if (level >= 45) return "CEO";
  if (level >= 35) return "Founder";
  if (level >= 25) return "Architect";
  if (level >= 15) return "Engineer";
  if (level >= 7) return "Developer";
  return "Explorer";
}

export async function awardXp(userId: string, amount: number, reason: string) {
  const user = await prisma.userProfile.findUniqueOrThrow({ where: { id: userId } });
  let nextLevel = user.level;
  const nextXp = user.xp + amount;

  while (nextXp >= levelThreshold(nextLevel + 1)) {
    nextLevel += 1;
  }

  await prisma.usageEvent.create({
    data: { userId, type: "AI_CHAT", amount, metadata: { reason, metric: "xp" } }
  });

  return prisma.userProfile.update({
    where: { id: userId },
    data: {
      xp: nextXp,
      level: nextLevel,
      coins: { increment: Math.max(1, Math.floor(amount / 5)) }
    }
  });
}
