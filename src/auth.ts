import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const adminRouter = express.Router();

adminRouter.post("/login", (req, res) => {
  const { login, password } = req.body;

  const adminLog = process.env.ADMIN_LOGIN;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (login !== adminLog || password !== adminPass) {
    console.log("Oups");
    return res.status(401).json({ error: "Dziś nie srasz" });
  }

  console.log("Work well");

  const token = jwt.sign(
    {
      role: "admin",
      login,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

export default adminRouter;
