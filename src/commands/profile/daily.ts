import { SlashCommandBuilder } from "discord.js";
import type { ForgeCommand } from "../../types/command.js";
import { prisma } from "../../database/prisma.js";
import { upsertProfile } from "../../services/profile.service.js";
import { forgeEmbed } from "../../utils/discord-ui.js";
import { awardXp } from "../../services/xp.service.js";

function isSameUtcDay(left?: Date | null) {
  if (!left) return false;
  const right = new Date();
  return left.getUTCFullYear() === right.getUTCFullYear() && left.getUTCMonth() === right.getUTCMonth() && left.getUTCDate() === right.getUTCDate();
}

const command: ForgeCommand = {
  category: "economy",
  data: new SlashCommandBuilder().setName("daily").setDescription("Claim your daily Forge rewards"),
  async execute(interaction) {
    const profile = await upsertProfile(interaction.user);

    if (isSameUtcDay(profile.lastDailyClaimAt)) {
      await interaction.reply({ ephemeral: true, embeds: [forgeEmbed("Daily already claimed", "Come back tomorrow for more XP and Forge Coins.")] });
      return;
    }

    const streak = profile.dailyStreak + 1;
    const coins = 50 + Math.min(streak * 5, 100);
    await prisma.userProfile.update({
      where: { id: profile.id },
      data: { coins: { increment: coins }, dailyStreak: streak, lastDailyClaimAt: new Date() }
    });
    await awardXp(profile.id, 25, "daily_claim");

    await interaction.reply({
      embeds: [forgeEmbed("Daily reward claimed", `You earned **${coins} Forge Coins**, **25 XP**, and extended your streak to **${streak}**.`)]
    });
  }
};

export default command;
