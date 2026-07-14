import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files allowed"), false);
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize: 1000 * 1024 * 1024,
  },

  fileFilter,
});

export default upload;