-- CreateEnum
CREATE TYPE "PremiumTier" AS ENUM ('FREE', 'PREMIUM', 'FOUNDER');

-- CreateEnum
CREATE TYPE "UsageType" AS ENUM ('AI_CHAT', 'IMAGE', 'GAME', 'CODING', 'LEARNING', 'CREATOR');

-- CreateEnum
CREATE TYPE "AchievementRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "dailyStreak" INTEGER NOT NULL DEFAULT 0,
    "aiUsageToday" INTEGER NOT NULL DEFAULT 0,
    "imageUsageToday" INTEGER NOT NULL DEFAULT 0,
    "premiumTier" "PremiumTier" NOT NULL DEFAULT 'FREE',
    "preferredModel" TEXT NOT NULL DEFAULT 'gemini-flash',
    "lastDailyClaimAt" TIMESTAMP(3),
    "usageResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New conversation',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rarity" "AchievementRarity" NOT NULL DEFAULT 'COMMON',
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "coinReward" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "UsageType" NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomyEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coins" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EconomyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildSettings" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "welcomeChannelId" TEXT,
    "logChannelId" TEXT,
    "aiNewsChannelId" TEXT,
    "enableVoiceXp" BOOLEAN NOT NULL DEFAULT true,
    "enableAiModeration" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuildSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_discordId_key" ON "UserProfile"("discordId");

-- CreateIndex
CREATE INDEX "UserProfile_xp_idx" ON "UserProfile"("xp");

-- CreateIndex
CREATE INDEX "UserProfile_coins_idx" ON "UserProfile"("coins");

-- CreateIndex
CREATE INDEX "UserProfile_level_idx" ON "UserProfile"("level");

-- CreateIndex
CREATE INDEX "Conversation_userId_updatedAt_idx" ON "Conversation"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "ConversationMessage_conversationId_createdAt_idx" ON "ConversationMessage"("conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "UsageEvent_userId_type_createdAt_idx" ON "UsageEvent"("userId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "EconomyEvent_userId_createdAt_idx" ON "EconomyEvent"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GuildSettings_guildId_key" ON "GuildSettings"("guildId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMessage" ADD CONSTRAINT "ConversationMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomyEvent" ADD CONSTRAINT "EconomyEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
