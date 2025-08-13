import multer from "multer";

const storage = multer.memoryStorage();

export const serviceImageUpload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") &&
      ["png", "jpeg", "webp", "svg+xml"].some((type) => file.mimetype.endsWith(type))
    ) {
      cb(null, true);
    } else {
      cb(new Error("Unaccepted file type"));
    }
  },
  storage: multer.memoryStorage(),
});
