import { Worker } from "bullmq";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import dotenv from "dotenv"
import { v2 as cloudinary} from "cloudinary"
import axios from "axios";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import redisConnection from "../../config/redis.js";
import Video from "../../../models/video.model.js"
import connectDB from "../../config/db.js"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(
  {
  path: path.resolve(__dirname, "../../../.env"),
}
)


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

await connectDB().then(() => {
  console.log("Worker DB Connected");
})

ffmpeg.setFfmpegPath(ffmpegPath);
const TEMP_DIR = path.join(__dirname, "../../temp");
fs.mkdirSync(TEMP_DIR, { recursive: true });

const worker = new Worker(
  "process-video",

  async (job) => {
    const { videoUrl, videoId } = job.data;

    console.log(
      `Starting Job: ${job.id}`
    );

    console.log("JOB DATA:", job.data);
    console.log("videoUrl:", videoUrl);
    console.log("videoId:", videoId);

    const uniqueId = uuid();
    const inputPath = path.join(
      TEMP_DIR,
      `${uniqueId}-input.mp4`
    );

    const thumbnailPath = path.join(
      TEMP_DIR,
      `${uniqueId}-thumb.jpg`
    );

    try {
      await Video.findByIdAndUpdate(
        job.id,
        {
          status: "DOWNLOADING",
        }
      );

      console.log(
        "Downloading video..."
      );

      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(inputPath);

      response.data.pipe(writer);

      await new Promise(
        (resolve, reject) => {
          writer.on(
            "finish",
            resolve
          );

          writer.on(
            "error",
            reject
          );
        }
      );

      console.log(
        "Video downloaded"
      );

      await Video.findByIdAndUpdate(
        job.id,
        {
          status:
            "GENERATING_THUMBNAIL",
        }
      );

      console.log(
        "Generating thumbnail..."
      );

      await new Promise(
        (resolve, reject) => {
          ffmpeg(inputPath)

            .screenshots({
              timestamps: ["1"],
              filename:
                path.basename(
                  thumbnailPath
                ),

              folder: TEMP_DIR,
            })
            .on("end", resolve)
            .on("error", reject);
        }
      );

      console.log(
        "Thumbnail generated"
      );

      await Video.findByIdAndUpdate(
        job.id,
        {
          status:
            "UPLOADING_THUMBNAIL",
        }
      );

      console.log(
        "Uploading thumbnail..."
      );
      console.log(process.env.CLOUDINARY_API_KEY);
      // console.log("Current config:", cloudinary.config());

      const uploadedThumbnail =
        await cloudinary.uploader.upload(
          thumbnailPath,
          {
            folder: "thumbnailaths",
            resource_type: "image",
          }
        );

      console.log("Thumbnail uploaded",uploadedThumbnail.secure_url);

      await Video.findByIdAndUpdate(
        videoId,
        {
          thumbnail:
            uploadedThumbnail.secure_url,
          status: "COMPLETED",
        }
      );

      console.log(
        `Job ${job.id} completed`
      );

      return true;
    } catch (error) {
      console.log(
        "Worker Error:",
        error.stack
      );
      await Video.findByIdAndUpdate(
        videoId,
        {
          status: "FAILED",

          failureReason:
            error.message,
        }
      );

      throw error;
    } finally {

      if (
        fs.existsSync(inputPath)
      ) {
        fs.unlinkSync(inputPath);
      }

      if (
        fs.existsSync(
          thumbnailPath
        )
      ) {
        fs.unlinkSync(
          thumbnailPath
        );
      }
    }
  },

  {
    connection: redisConnection,
    concurrency: 3,
  }
);


worker.on("ready", () => {
  console.log("Worker ready");
});

worker.on(
  "completed",

  (job) => {
    console.log(
      `Job ${job.id} completed`
    );
  }
);

worker.on(
  "failed",

  (job, error) => {
    console.log(
      `Job ${job?.id} failed`
    );
    console.log(error);
  }
);

worker.on(
  "error",

  (error) => {
    console.log(
      "Worker Connection Error:",
      error
    );
  }
);