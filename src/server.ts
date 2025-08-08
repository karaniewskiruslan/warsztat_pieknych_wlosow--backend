import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRouter from "./authentication/auth";
import servicesRouter from "./servicesList/services";
import { imagesServiceSchema } from "./image-uploads/validate";
import { serviceImageUpload } from "./image-uploads/image-uploads";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", adminRouter);
app.use("/api", servicesRouter);
app.use("/images/", express.static("images"));

app.get("/", (_req, res) => {
  res.send("Witaj w Warsztata Pięknych włosów, część serwerowa");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
