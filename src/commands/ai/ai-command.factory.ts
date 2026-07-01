import { SlashCommandBuilder } from "discord.js";
import type { ForgeCommand } from "../../types/command.js";
import { forgeEmbed, supportRow } from "../../utils/discord-ui.js";
import { upsertProfile } from "../../services/profile.service.js";
import { runAiPrompt } from "../../services/ai.service.js";

type AiCommandConfig = {
  name: string;
  description: string;
  promptLabel?: string;
  system: string;
  category: string;
};

function trimDiscord(value: string, max = 3800) {
  return value.length > max ? `${value.slice(0, max - 20)}\n\n...truncated` : value;
}

export function createAiCommand(config: AiCommandConfig): ForgeCommand {
  return {
    category: config.category,
    data: new SlashCommandBuilder()
      .setName(config.name)
      .setDescription(config.description)
      .addStringOption((option) =>
        option
          .setName("prompt")
          .setDescription(config.promptLabel ?? "What should ForgeBot help with?")
          .setRequired(true)
          .setMaxLength(3000)
      )
      .addStringOption((option) =>
        option
          .setName("model")
          .setDescription("Optional model override")
          .setRequired(false)
          .addChoices(
            { name: "Gemini 2.5 Flash", value: "gemini-2.5-flash" },
            { name: "Gemini 2.5 Pro", value: "gemini-2.5-pro" },
            { name: "Qwen Coder", value: "qwen/qwen-2.5-coder-32b-instruct" },
            { name: "Mistral Small", value: "mistralai/mistral-small" },
            { name: "Llama 3.1", value: "meta-llama/llama-3.1-8b-instruct" }
          )
      ),
    async execute(interaction) {
      await interaction.deferReply();

      const profile = await upsertProfile(interaction.user);
      const prompt = interaction.options.getString("prompt", true);
      const model = interaction.options.getString("model") ?? profile.preferredModel;

      const result = await runAiPrompt({
        userId: profile.id,
        channelId: interaction.channelId,
        model,
        system: config.system,
        prompt,
        title: config.name
      });

      await interaction.editReply({
        embeds: [forgeEmbed(`${config.description}`, trimDiscord(result.content)).addFields({ name: "Model", value: `${result.provider} / ${result.model}`, inline: true })],
        components: [supportRow()]
      });
    }
  };
}
