import { SlashCommandBuilder } from "discord.js";
import type { ForgeCommand } from "../../types/command.js";
import { getLeaderboard } from "../../services/profile.service.js";
import { forgeEmbed } from "../../utils/discord-ui.js";

const command: ForgeCommand = {
  category: "community",
  data: new SlashCommandBuilder().setName("leaderboard").setDescription("View the top ForgeBot users"),
  async execute(interaction) {
    const leaders = await getLeaderboard(10);
    const lines = leaders.map((user, index) => `**${index + 1}. ${user.username}** - Lv ${user.level} - ${user.xp.toLocaleString()} XP`);
    await interaction.reply({ embeds: [forgeEmbed("Forge Leaderboard", lines.join("\n") || "No profiles yet.")] });
  }
};

export default command;
