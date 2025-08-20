import dotenv from "dotenv";
import express from "express";
import { mastersInfo } from "../../initialData/masters.data";
import { MasterType } from "../../types/masters.type";
import { responseService } from "../../helpers/helpers";

dotenv.config();
const mastersRouter = express.Router();

const mastersList: MasterType[] = mastersInfo;

mastersRouter.get("/masters", (req, res) => {
  const mapped = responseService(req, mastersList);

  res.status(200).send(mapped);
});

export default mastersRouter;
