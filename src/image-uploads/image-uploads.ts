import multer from "multer";

const storage = multer.memoryStorage();

export const serviceImageUpload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/svg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Unaccepted file type"));
    }
  },
  storage: multer.memoryStorage(),
});
