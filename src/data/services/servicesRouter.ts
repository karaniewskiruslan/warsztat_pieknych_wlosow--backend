import dotenv from 'dotenv';
import express, { Request } from 'express';
import { Services } from '../../types/services.type';
import { servicesList } from '../../initialData/services.data';
import { serviceImageUpload } from '../../image-uploads/imageUploads';
import { imagesServiceSchema } from '../../image-uploads/validate';
import { v4 as uId } from 'uuid';
import path from 'path';
import { unlink, writeFile } from 'fs/promises';
import { getImageUrl, responseService } from '../../helpers/helpers';
import db from '../../mongodb/init';

dotenv.config();
const servicesRouter = express.Router();

const generateId = (req: Request): number => {
  return servicesList(req).length ? Math.max(...servicesList(req).map((s) => s._id)) + 1 : 1;
};

servicesRouter.get('/services', async (req, res) => {
  try {
    const collection = db.collection<Services>('serviceList');
    const result = await collection.find({}).toArray();

    if (!result || result.length === 0) {
      return res.status(404).send({ error: 'No services found in database.' });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching services:', err);
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

    const newService: Services = {
      _id: generateId(req),
      name,
      image: getImageUrl(req, filePath),
      category,
      masters: JSON.parse(masters),
      last: JSON.parse(last),
      options: options ? JSON.parse(options) : [],
      cost: JSON.parse(cost),
    };

    const collection = db.collection<Services>('serviceList');
    const result = await collection.insertOne(newService);

    return res.status(201).json(result);
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

    const result = await collection.updateOne({ _id: id }, { $set: updatedServiceData });

    return res.status(200).json({ success: true, updated: result.modifiedCount > 0, service: updatedServiceData });
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
