import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import Video from "../models/video.model.js";
import { videoQueue } from "../redis/queues/video.queue.js";

export const uploadVideo = async (
  req,
  res
) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video required",
      });
    }

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "videos",
        },

        async (error, result) => {
          if (error) {
            return res.status(500).json({
              success: false,
              message: "Cloudinary upload failed",
            });
          }
          const video = await Video.create({
            title: req.body.title,
            description: req.body.description,
            originalVideo: result.secure_url,

            status: "QUEUED",
          });

          await videoQueue.add(
            "process-video",

            {
              videoId: video._id,

              videoUrl: result.secure_url,
            },

            {
              jobId: video._id.toString(),
            }
          );

          return res.status(201).json({
            success: true,

            video,
          });
        }
      );

    streamifier
      .createReadStream(req.file.buffer)
      .pipe(uploadStream);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};