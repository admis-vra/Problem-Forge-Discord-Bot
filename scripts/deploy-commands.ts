import { REST, Routes } from "discord.js";
import { commands } from "../src/commands/index.js";
import { env } from "../src/config/env.js";
import { logger } from "../src/utils/logger.js";

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
const body = commands.map((command) => command.data.toJSON());

async function main() {
  if (env.DISCORD_GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), { body });
    logger.info({ count: body.length, guildId: env.DISCORD_GUILD_ID }, "Registered guild commands");
    return;
  }

  await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body });
  logger.info({ count: body.length }, "Registered global commands");
}

main().catch((error) => {
  logger.fatal({ error }, "Failed to deploy commands");
  process.exit(1);
});
