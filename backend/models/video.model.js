import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: String,
    status: {
      type: String,
     enum: [
   "QUEUED",
   "DOWNLOADING",
   "GENERATING_THUMBNAIL",
   "UPLOADING_THUMBNAIL",
   "COMPLETED",
   "FAILED"
  ],

      default: "QUEUED",
    },
    originalVideo: String,
    description: { type: String},
    compressedVideo: String,
    thumbnail: String,
    failureReason: String,
  },
  { timestamps: true }
);


const Video =  mongoose.model(
  "Video",
  videoSchema
);

export default Video;