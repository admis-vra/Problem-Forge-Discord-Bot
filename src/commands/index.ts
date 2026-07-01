import ask from "./ai/ask.js";
import explain from "./ai/explain.js";
import models from "./ai/models.js";
import rewrite from "./ai/rewrite.js";
import summarize from "./ai/summarize.js";
import code from "./coding/code.js";
import debug from "./coding/debug.js";
import review from "./coding/review.js";
import caption from "./creator/caption.js";
import daily from "./profile/daily.js";
import leaderboard from "./profile/leaderboard.js";
import profile from "./profile/profile.js";
import quiz from "./learning/quiz.js";
import startup from "./startup/startup.js";
import type { ForgeCommand } from "../types/command.js";

export const commands: ForgeCommand[] = [
  ask,
  explain,
  summarize,
  rewrite,
  models,
  code,
  debug,
  review,
  caption,
  quiz,
  startup,
  profile,
  leaderboard,
  daily
];

export const commandMap = new Map(commands.map((command) => [command.data.name, command]));
