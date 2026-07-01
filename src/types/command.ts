import type { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

export type ForgeCommand = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  category: string;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
};
