import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "../config/env.js";
import { prisma } from "../database/prisma.js";
import { logger } from "../utils/logger.js";

export function createApiServer() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.get("/health", async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, service: "forgebot", environment: env.NODE_ENV });
  });

  app.get("/api/v1/leaderboard", async (_req, res) => {
    const users = await prisma.userProfile.findMany({
      orderBy: { xp: "desc" },
      take: 25,
      select: { discordId: true, username: true, avatarUrl: true, xp: true, coins: true, level: true }
    });
    res.json({ users });
  });

  return app;
}
