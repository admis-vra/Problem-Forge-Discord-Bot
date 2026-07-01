# ProblemForge AI (ForgeBot)

Premium Discord AI platform foundation built with Node.js, TypeScript, Discord.js v14, PostgreSQL, Prisma, Docker, and Express.

## What is included

- Modular Discord bot architecture with slash command registry.
- AI provider abstraction for Gemini and OpenRouter, ready for DeepSeek, Gemma, Llama, Qwen, Mistral, and Phi expansion.
- Profile system with XP, coins, levels, streaks, premium tier, usage tracking, and preferred model.
- Conversation persistence through Prisma.
- Daily rewards, profile embeds, leaderboard, model browser, and representative AI, coding, creator, learning, and startup commands.
- Express REST API with health check and leaderboard endpoint.
- Prisma schema for users, conversations, achievements, usage, economy events, and guild settings.
- Docker and Docker Compose setup.

## Quick start

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run commands:deploy
npm run dev
```

## Environment variables

See `.env.example`.

Required:

- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `DATABASE_URL`

Recommended:

- `DISCORD_GUILD_ID` for fast guild command deployment during development.
- `GEMINI_API_KEY` for primary AI responses.
- `OPENROUTER_API_KEY` for multi-model routing.

## Commands

Current implemented commands:

- `/ask`
- `/explain`
- `/summarize`
- `/rewrite`
- `/models`
- `/code`
- `/debug`
- `/review`
- `/caption`
- `/quiz`
- `/startup`
- `/profile`
- `/leaderboard`
- `/daily`

The PRD command surface is intentionally represented through factories and service boundaries so adding more commands is mostly configuration plus specialized service logic.

## API

- `GET /health`
- `GET /api/v1/leaderboard`

## Deployment

### Docker

```bash
docker compose up --build
```

### Railway, Render, or VPS

1. Provision PostgreSQL.
2. Set all required environment variables.
3. Run `npm run build`.
4. Run `npm run prisma:deploy`.
5. Start with `npm start`.

## Architecture

```text
src/
  ai/          provider contracts and model routing
  api/         Express REST API
  commands/    slash command modules
  database/    Prisma client
  events/      Discord event handlers
  games/       game catalog and future game engines
  images/      image queue service
  moderation/  moderation policy hooks
  services/    profile, usage, XP, and AI orchestration
  utils/       logging and embed helpers
```

## Next production milestones

- Add Redis-backed queues for image jobs, news digests, and scheduled rewards.
- Add Discord OAuth dashboard in Next.js.
- Expand achievements from seed examples to the full 100+ achievement catalog.
- Add interaction components for paginated history, model switching, and game sessions.
- Add tests for services and command execution.
