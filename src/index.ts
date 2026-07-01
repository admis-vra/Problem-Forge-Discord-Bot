import { Client, GatewayIntentBits, Partials } from "discord.js";
import { createApiServer } from "./api/server.js";
import { env } from "./config/env.js";
import { prisma } from "./database/prisma.js";
import { handleInteraction } from "./events/interaction-create.js";
import { handleReady } from "./events/ready.js";
import { startCleanupJob } from "./services/cleanup.service.js";
import { logger } from "./utils/logger.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

client.once("ready", (readyClient) => handleReady(readyClient));
client.on("interactionCreate", handleInteraction);

let cleanupJob: NodeJS.Timeout | undefined;

async function main() {
  await prisma.$connect();

  const app = createApiServer();
  app.listen(env.PORT, () => logger.info({ port: env.PORT }, "ForgeBot API listening"));
  cleanupJob = startCleanupJob();

  await client.login(env.DISCORD_TOKEN);
}

async function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down ForgeBot");
  if (cleanupJob) clearInterval(cleanupJob);
  client.destroy();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

main().catch(async (error) => {
  logger.fatal({ error }, "ForgeBot failed to start");
  await prisma.$disconnect();
  process.exit(1);
});
