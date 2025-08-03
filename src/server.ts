import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRouter from "./auth";
import servicesRouter from "./servicesList/services";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", adminRouter);
app.use("/api", servicesRouter);

app.get("/", (_req, res) => {
  res.send("Witaj w Warsztata Pięknych włosów, część serwerowa");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
