import dotenv from "dotenv";
import express from "express";
import { mastersInfo } from "../../initialData/masters.data";
import { MasterType } from "../../types/masters.type";

dotenv.config();
const mastersRouter = express.Router();

mastersRouter.get("/masters", (req, res) => {
  const mastersList: MasterType[] = mastersInfo(req);

  res.status(200).send(mastersList);
});

export default mastersRouter;
