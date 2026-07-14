import multer from "multer";
import fs from "fs";
import path from "path";


const TEMP_DIR =
  path.resolve("temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {

    cb(null, TEMP_DIR);

  },

  filename: (
    req,
    file,
    cb
  ) => {

    const uniqueName =
      `${Date.now()}-${file.originalname}`;

    cb(null, uniqueName);

  },

});


const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    file.mimetype.startsWith(
      "video/"
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only video files allowed"
      ),
      false
    );

  }

};

const upload = multer({

  storage,

  limits: {
    fileSize:
      500 * 1024 * 1024,
  },

  fileFilter,

});

export default upload;
