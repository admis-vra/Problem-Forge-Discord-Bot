export const moderationActions = ["warn", "mute", "kick", "ban", "timeout", "audit-log"] as const;

export function shouldEscalateToxicity(score: number) {
  if (score >= 0.95) return "timeout";
  if (score >= 0.85) return "warn";
  return "audit-log";
}
