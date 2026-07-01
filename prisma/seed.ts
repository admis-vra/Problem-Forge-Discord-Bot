import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const achievements = [
  ["first-question", "First Question", "Ask ForgeBot your first question.", "COMMON", 25, 10],
  ["bug-hunter", "Bug Hunter", "Use the debug command to squash a coding issue.", "RARE", 75, 35],
  ["coding-wizard", "Coding Wizard", "Generate or review code with ForgeBot.", "EPIC", 150, 75],
  ["daily-grinder", "Daily Grinder", "Claim daily rewards repeatedly.", "RARE", 100, 50],
  ["ai-artist", "AI Artist", "Create your first AI image once image providers are enabled.", "RARE", 100, 50],
  ["quiz-champion", "Quiz Champion", "Complete AI-generated quizzes.", "EPIC", 125, 65],
  ["founder", "Founder", "Join the early ProblemForge community.", "LEGENDARY", 500, 250]
] as const;

async function main() {
  for (const [id, name, description, rarity, xpReward, coinReward] of achievements) {
    await prisma.achievement.upsert({
      where: { id },
      create: { id, name, description, rarity, xpReward, coinReward },
      update: { name, description, rarity, xpReward, coinReward }
    });
  }
}

main()
  .finally(async () => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
