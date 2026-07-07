import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import Video from "../models/video.model.js";
import { videoQueue } from "../redis/queues/video.queue.js";
import crypto from "crypto";
import fs from "fs";


export const uploadVideo = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file required",
      });
    }

    /*
      upload video to cloudinary
    */

    const uploadedVideo =
      await cloudinary.uploader.upload(
        req.file.path,

        {
          resource_type: "video",

          folder: "videos",

          timeout: 600000,
        }
      );

    /*
      remove local uploaded file
    */

    if (
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    /*
      save db
    */

    const video = await Video.create({
      title: req.body.title,

      description:
        req.body.description,

      originalVideo:
        uploadedVideo.secure_url,

      status: "QUEUED",
    });

    /*
      add queue job
    */

    await videoQueue.add(
      "process-video",

      {
        videoId: video._id,

        videoUrl:
          uploadedVideo.secure_url,
      },

      {
        jobId:
          video._id.toString(),
      }
    );

    /*
      response
    */

    return res.status(201).json({
      success: true,

      message:
        "Video uploaded successfully",

      video,
    });
  } catch (error) {
    console.log(
      "Error in uploadVideo controller:",
      error
    );

    /*
      cleanup failed upload
    */

    if (
      req.file?.path &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Upload failed",
    });
  }
};


export const getVideo = async(req, res) => {
  try {
    const data = await Video.find({});

    if(data.length < 1){
      return res.status(200).json({
        success: true,
        message: "No video to show",
      });
    }

    return res.status(200).json({
        success: true,
        data: data,
        message: "All videos are here",
      });

  } catch (error) {
    console.error("Error in fetching videos from the server:",error)
    return res.status(500).json({
        success: false,
        message: "Error from the server",
      });
  }
}

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid video id",
      });
    }

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video fetched successfully",
      video,
    });

  } catch (error) {

    console.error(
      "Error fetching video:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};