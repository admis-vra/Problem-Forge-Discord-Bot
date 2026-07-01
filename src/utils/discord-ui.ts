import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

export const colors = {
  primary: 0x7c3aed,
  success: 0x10b981,
  warning: 0xf59e0b,
  danger: 0xef4444,
  neutral: 0x2b2d31
};

export function forgeEmbed(title: string, description: string) {
  return new EmbedBuilder()
    .setColor(colors.primary)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: "ProblemForge AI" });
}

export function supportRow() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("profile").setLabel("Profile").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("models").setLabel("Models").setStyle(ButtonStyle.Secondary)
  );
}
