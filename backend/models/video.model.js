import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: String,
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

    originalVideo: String,
    description: { type: String},
    compressedVideo: String,
    thumbnail: String,
    failureReason: String,
  },
  { timestamps: true }
);


export default mongoose.model(
  "Video",
  videoSchema
);