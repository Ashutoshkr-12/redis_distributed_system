import mongoose, { model, Schema } from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    originalVideoUrl: {type: String},
    compressedVideoUrl: {type: String},
    thumbnailUrl: {type: string},
    status: {
      type: String,
      enum: [
        "UPLOADING",
        "QUEUED",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
      ],
      default: "UPLOADING",
    },

    failureReason: {type: String},
  },
  { timestamps: true }
);

const Video = model("Video", videoSchema);

export default Video;