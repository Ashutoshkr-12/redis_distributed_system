import { Router } from "express";
import { uploadVideo } from "../controllers/video.controller.js";

const router = Router()

router.route("/upload-video").post(uploadVideo);

export default router;