import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_GUILD_ID: z.string().optional(),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.string().default("info"),
  GEMINI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),
  FREE_AI_REQUESTS_PER_DAY: z.coerce.number().int().positive().default(20),
  FREE_IMAGE_REQUESTS_PER_DAY: z.coerce.number().int().positive().default(5),
  CONVERSATION_RETENTION_HOURS: z.coerce.number().int().positive().default(24)
});

export const env = envSchema.parse(process.env);
