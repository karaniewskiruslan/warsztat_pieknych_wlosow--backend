import dotenv from 'dotenv';
import express from 'express';
import db from '../../mongodb/init';
import { MasterType } from '../../types/masters.type';

dotenv.config();
const mastersRouter = express.Router();

mastersRouter.get('/masters', async (_req, res) => {
  try {
    const collection = db.collection<MasterType>('masterList');
    const result = await collection.find({}).toArray();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: 'Internal server error: ' + err });
  }
});

export default mastersRouter;
