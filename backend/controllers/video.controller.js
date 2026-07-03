import Video from "../models/video.model.js";
import { videoQueue } from "../queue/video.queue.js";

export const uploadVideo = async (req, res) => {
  try {
    const { title, originalVideoUrl } = req.body;
    const video = await Video.create({
      title,
      originalVideoUrl,
      status: "QUEUED",
    });

    await videoQueue.add("process-video", {
      videoId: video._id,
      originalVideoUrl,
    });

    res.status(201).json({
      success: true,
      message: "Video Fetched",
      data: video,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};