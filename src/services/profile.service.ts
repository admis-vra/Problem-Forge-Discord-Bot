import type { User } from "discord.js";
import { prisma } from "../database/prisma.js";

export async function upsertProfile(user: User) {
  return prisma.userProfile.upsert({
    where: { discordId: user.id },
    create: {
      discordId: user.id,
      username: user.username,
      avatarUrl: user.displayAvatarURL()
    },
    update: {
      username: user.username,
      avatarUrl: user.displayAvatarURL()
    }
  });
}

export async function getLeaderboard(limit = 10) {
  return prisma.userProfile.findMany({
    orderBy: [{ xp: "desc" }, { coins: "desc" }],
    take: limit
  });
}
