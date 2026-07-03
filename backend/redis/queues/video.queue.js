import { Queue } from "bullmq";
import { redis } from "../../index.js";

export const videoQueue = new Queue("video-processing", {
  connection: redis,
});

