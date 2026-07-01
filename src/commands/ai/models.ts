import { SlashCommandBuilder } from "discord.js";
import type { ForgeCommand } from "../../types/command.js";
import { listProviders } from "../../ai/provider-registry.js";
import { forgeEmbed } from "../../utils/discord-ui.js";

const command: ForgeCommand = {
  category: "ai",
  data: new SlashCommandBuilder().setName("models").setDescription("Browse available ForgeBot AI models"),
  async execute(interaction) {
    const providers = listProviders();
    const body = providers
      .map((provider) => `**${provider.displayName}** ${provider.configured ? "configured" : "not configured"}\n${provider.models.map((model) => `• \`${model}\``).join("\n")}`)
      .join("\n\n");

    await interaction.reply({ ephemeral: true, embeds: [forgeEmbed("AI Model Forge", body)] });
  }
};

export default command;
