import { SlashCommandBuilder } from "discord.js";
import type { ForgeCommand } from "../../types/command.js";
import { upsertProfile } from "../../services/profile.service.js";
import { forgeEmbed } from "../../utils/discord-ui.js";
import { titleForLevel } from "../../services/xp.service.js";

const command: ForgeCommand = {
  category: "community",
  data: new SlashCommandBuilder().setName("profile").setDescription("View your ForgeBot profile"),
  async execute(interaction) {
    const profile = await upsertProfile(interaction.user);
    await interaction.reply({
      embeds: [
        forgeEmbed(`${interaction.user.username}'s Forge Profile`, "Your ProblemForge journey at a glance.")
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields(
            { name: "Rank", value: titleForLevel(profile.level), inline: true },
            { name: "Level", value: String(profile.level), inline: true },
            { name: "XP", value: profile.xp.toLocaleString(), inline: true },
            { name: "Forge Coins", value: profile.coins.toLocaleString(), inline: true },
            { name: "Daily Streak", value: `${profile.dailyStreak} days`, inline: true },
            { name: "Favorite AI", value: profile.preferredModel, inline: true }
          )
      ]
    });
  }
};

export default command;
