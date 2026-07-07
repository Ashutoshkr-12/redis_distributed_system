import { Router } from "express";
import { getVideo, getVideoById, uploadVideo } from "../controllers/video.controller.js";
import upload from "../config/multer.js";

const router = Router()

router.route("/upload-video").post(upload.single("video"),uploadVideo);
router.route("/video/all").get(getVideo);
router.route("/video/:id").get(getVideoById);


export default router;