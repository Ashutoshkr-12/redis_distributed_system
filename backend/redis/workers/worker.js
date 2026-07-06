import { Worker } from "bullmq";

import Redis from "ioredis";

import ffmpeg from "fluent-ffmpeg";

import ffmpegPath from "ffmpeg-static";

import axios from "axios";

import fs from "fs";

import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath);

const connection = new Redis({
  host: "127.0.0.1",
  port: 6379,

  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "video-processing",

  async (job) => {
    const { videoUrl } = job.data;

    console.log("Processing:", videoUrl);

    /*
      download temp file
    */

    const inputPath =
      "./temp/input.mp4";

    const outputThumbnail =
      "./temp/thumb.jpg";

    /*
      download video
    */

    const response = await axios({
      url: videoUrl,

      method: "GET",

      responseType: "stream",
    });

    const writer =
      fs.createWriteStream(inputPath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);

      writer.on("error", reject);
    });

    /*
      generate thumbnail
    */

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({
          timestamps: ["2"],

          filename: "thumb.jpg",

          folder: "./temp",
        })

        .on("end", resolve)

        .on("error", reject);
    });

    console.log("Thumbnail generated");
  },

  {
    connection,

    concurrency: 3,
  }
);