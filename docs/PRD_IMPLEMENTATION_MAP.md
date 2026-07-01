# PRD Implementation Map

This repository is a production-oriented foundation for the attached ProblemForge AI PRD.

## Implemented foundation

- Discord.js v14 TypeScript bot.
- PostgreSQL and Prisma data model.
- Modular command, service, provider, and event structure.
- AI provider registry with Gemini primary and OpenRouter multi-model support.
- Profiles, XP, coins, levels, premium tier, usage tracking, daily rewards, leaderboards, and conversations.
- Express REST API for shared backend integration.
- Image queue placeholder service designed for provider workers.
- Game catalog placeholder for AI games and mini games.
- Moderation policy hook for future AI toxicity scoring.
- Docker deployment files and setup docs.

## Command expansion pattern

Most text-generation commands can be added with `createAiCommand`:

```ts
export default createAiCommand({
  name: "prd",
  description: "Generate a product requirements document",
  category: "startup",
  system: "Generate a clear PRD with goals, users, scope, requirements, risks, and milestones."
});
```

Special commands should get their own service when they need state, buttons, modals, select menus, queues, leaderboards, or background jobs.

## Recommended next layer

1. Add Redis and BullMQ for image/news/game queues.
2. Build Next.js dashboard with Discord OAuth.
3. Add a command generator script for the remaining PRD commands.
4. Add scheduled AI news digest jobs.
5. Add integration tests using mocked Discord interactions and mocked AI providers.
