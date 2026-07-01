import type { Client } from "discord.js";
import { logger } from "../utils/logger.js";

export function handleReady(client: Client<true>) {
  logger.info({ tag: client.user.tag, guilds: client.guilds.cache.size }, "ForgeBot is online");
}
