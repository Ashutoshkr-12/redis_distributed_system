import { Worker } from "bullmq";
import Redis from "ioredis";
import { redis } from "../../index.js";

const worker = new Worker(
  "video-processing",
  async (job) => {
    console.log("Processing Job:", job.data);

    /*
      STEPS:
      1. Download video
      2. Compress
      3. Generate thumbnail
      4. Upload processed files
      5. Update DB
    */
  },

  {
    redis,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job failed`, err);
});