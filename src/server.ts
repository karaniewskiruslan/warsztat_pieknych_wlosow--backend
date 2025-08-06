import express from "express";
import * as yup from "yup";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import adminRouter from "./authentication/auth";
import servicesRouter from "./servicesList/services";
import { validateBufferMIMEType } from "validate-image-type";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "images/services");
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });



const testServicesImageUpload = yup
  .mixed<Express.Multer.File>()
  .test("valid-image", "The uploaded file is not a valid image", async (file) => {
    if (!file) return true;
    const result = await validateBufferMIMEType(file.buffer, {
      allowMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/svg"],
    });
    return result.ok;
  });

app.use(cors());
app.use(express.json());

app.use("/api", adminRouter);
app.use("/api", servicesRouter);
app.use("/images/", express.static("images"));

app.get("/", (_req, res) => {
  res.send("Witaj w Warsztata Pięknych włosów, część serwerowa");
});

app.post("/api/upload", upload.single("servicePhoto"), (req, res) => {
  res.status(200).json(req.file);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
