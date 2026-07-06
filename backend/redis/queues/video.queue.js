import { Queue } from "bullmq";
import redisConnection from "../../config/redis.js";

export const videoQueue = new Queue("video-processing", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 5,

    backoff: {
      type: "exponential",
      delay: 3000,
    },

    removeOnComplete: 100,

    removeOnFail: 500,
  }
});

