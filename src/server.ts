import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import adminRouter from "./authification/auth";
import servicesRouter from "./servicesList/services";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/images");
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

app.use("/api", adminRouter);
app.use("/api", servicesRouter);

app.get("/", (_req, res) => {
  res.send("Witaj w Warsztata Pięknych włosów, część serwerowa");
});

app.post("/api/upload", upload.single("photo"), (req, res) => {
  res.status(200).json(req.file);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
