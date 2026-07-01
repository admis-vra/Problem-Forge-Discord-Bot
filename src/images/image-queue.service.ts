import { UsageType } from "@prisma/client";
import { assertUsageAllowed, recordUsage } from "../services/usage.service.js";

export type ImageJob = {
  id: string;
  userId: string;
  prompt: string;
  kind: "image" | "logo" | "wallpaper" | "poster" | "anime" | "thumbnail" | "avatar" | "banner";
  status: "queued" | "processing" | "completed" | "failed";
  createdAt: Date;
};

const queue: ImageJob[] = [];

export async function enqueueImageJob(userId: string, prompt: string, kind: ImageJob["kind"]) {
  await assertUsageAllowed(userId, UsageType.IMAGE);
  const job: ImageJob = {
    id: crypto.randomUUID(),
    userId,
    prompt,
    kind,
    status: "queued",
    createdAt: new Date()
  };
  queue.push(job);
  await recordUsage(userId, UsageType.IMAGE, { kind });
  return job;
}

export function getImageQueueSnapshot() {
  return queue.slice(0, 100);
}
