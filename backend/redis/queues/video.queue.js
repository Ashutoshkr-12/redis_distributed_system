import { Queue } from "bullmq";
import redisConnection from "../../config/redis.js";

export const videoQueue = new Queue("process-video", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
  }
});

