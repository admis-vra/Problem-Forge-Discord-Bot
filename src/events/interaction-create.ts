import type { ButtonInteraction, Interaction } from "discord.js";
import { listProviders } from "../ai/provider-registry.js";
import { commandMap } from "../commands/index.js";
import { upsertProfile } from "../services/profile.service.js";
import { titleForLevel } from "../services/xp.service.js";
import { forgeEmbed } from "../utils/discord-ui.js";
import { logger } from "../utils/logger.js";

export async function handleInteraction(interaction: Interaction) {
  if (interaction.isButton()) {
    await handleButton(interaction);
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = commandMap.get(interaction.commandName);
  if (!command) {
    await interaction.reply({ ephemeral: true, embeds: [forgeEmbed("Unknown command", "That ForgeBot command is not registered in this build.")] });
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error({ error, command: interaction.commandName, user: interaction.user.id }, "Command failed");
    const message = { ephemeral: true, embeds: [forgeEmbed("ForgeBot hit an error", error instanceof Error ? error.message : "Something went wrong.")] };

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(message);
    } else {
      await interaction.reply(message);
    }
  }
}

async function handleButton(interaction: ButtonInteraction) {
  try {
    if (interaction.customId === "profile") {
      const profile = await upsertProfile(interaction.user);
      await interaction.reply({
        ephemeral: true,
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
      return;
    }

    if (interaction.customId === "models") {
      const body = listProviders()
        .map((provider) => `**${provider.displayName}** ${provider.configured ? "configured" : "not configured"}\n${provider.models.map((model) => `- \`${model}\``).join("\n")}`)
        .join("\n\n");

      await interaction.reply({ ephemeral: true, embeds: [forgeEmbed("AI Model Forge", body)] });
      return;
    }

    await interaction.reply({ ephemeral: true, embeds: [forgeEmbed("Unknown button", "That button is not connected yet.")] });
  } catch (error) {
    logger.error({ error, customId: interaction.customId, user: interaction.user.id }, "Button interaction failed");
    await interaction.reply({ ephemeral: true, embeds: [forgeEmbed("Button failed", error instanceof Error ? error.message : "Something went wrong.")] });
  }
}
