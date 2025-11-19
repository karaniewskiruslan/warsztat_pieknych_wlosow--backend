import dotenv from 'dotenv';
import express from 'express';
import { v4 as uId } from 'uuid';
import path from 'path';
import { unlink, writeFile } from 'fs/promises';
import db from '@config/mongo';
import { getImageUrl } from '@helpers/helpers';
import { Services } from '@models/services.type';
import { serviceImageUpload } from '@imageUpload/imageUploads';

dotenv.config();
const servicesRouter = express.Router();

servicesRouter.get('/services', async (_req, res) => {
  try {
    const collection = db.collection<Services>('serviceList');
    const result = await collection.find({}).toArray();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: 'Internal server error.' });
  }
});

servicesRouter.post('/services', serviceImageUpload.single('image'), async (req, res) => {
  const { name, category, masters, last, options, cost } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'File not founded' });

  try {
    const uniqueFilename = `${uId()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = path.join('images', 'services', uniqueFilename);

    const collection = db.collection<Services>('serviceList');
    const newArray = await collection.find({}).toArray();

    const newService: Services = {
      _id: newArray.length + 1,
      name,
      image: getImageUrl(req, filePath),
      category,
      masters: JSON.parse(masters),
      last: JSON.parse(last),
      options: options ? JSON.parse(options) : [],
      cost: JSON.parse(cost),
    };

    await collection.insertOne(newService);

    const inserted = await collection.findOne({ _id: newService._id });

    return res.status(201).json(inserted);
  } catch (err) {
    res.status(400).send({ error: 'Adding item error: ' + err });
  }
});

servicesRouter.put('/services/:id', serviceImageUpload.single('image'), async (req, res) => {
  const id = +req.params.id;
  const { name, category, last, masters, options, cost } = req.body;

  try {
    const collection = db.collection<Services>('serviceList');
    const existingService = await collection.findOne({ _id: id });

    if (!existingService) {
      return res.status(404).json({ error: 'Service not found' });
    }

    let imageUrl = existingService.image;
    const newFile = req.file;

    if (newFile) {
      const filename = `${uId()}-${newFile.originalname.replace(/\s+/g, '_')}`;
      const newImagePath = path.join(process.cwd(), 'images', 'services', filename);
      await writeFile(newImagePath, newFile.buffer);
      imageUrl = getImageUrl(req, newImagePath);

      if (existingService.image?.startsWith(`${req.protocol}://${req.get('host')}/images/services/`)) {
        const oldPath = path.join(
          process.cwd(),
          existingService.image.replace(`${req.protocol}://${req.get('host')}/`, '')
        );
        await unlink(oldPath).catch(() => console.warn('Failed to delete old image'));
      }
    }

    const updatedServiceData: Services = {
      ...existingService,
      name,
      category,
      masters: JSON.parse(masters),
      last: JSON.parse(last),
      options: options ? JSON.parse(options) : [],
      cost: JSON.parse(cost),
      image: imageUrl,
    };

    await collection.updateOne({ _id: id }, { $set: updatedServiceData });
    const inserted = await collection.findOne({ _id: id });

    return res.status(200).json(inserted);
  } catch (err) {
    res.status(400).send({ error: 'Update item error: ' + err });
  }
});

servicesRouter.delete('/services/:id', async (req, res) => {
  const id = +req.params.id;

  try {
    const collection = db.collection<Services>('serviceList');
    const service = await collection.findOne({ _id: id });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.image?.startsWith(`${req.protocol}://${req.get('host')}/images/services/`)) {
      const filePath = path.join(process.cwd(), service.image.replace(`${req.protocol}://${req.get('host')}/`, ''));
      await unlink(filePath).catch(() => console.warn('Failed to delete old image'));
    }

    const result = await collection.deleteOne({ _id: id });

    return res.status(200).json({ success: true, deleted: result.deletedCount > 0 });
  } catch (err) {
    res.status(400).json({ error: 'Delete item error: ' + err });
  }
});

export default servicesRouter;
