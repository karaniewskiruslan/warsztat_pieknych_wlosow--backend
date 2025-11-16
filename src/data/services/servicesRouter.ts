import dotenv from 'dotenv';
import express, { Request } from 'express';
import { ObjectId } from 'mongodb';
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
  return servicesList(req).length ? Math.max(...servicesList(req).map((s) => s.id)) + 1 : 1;
};

servicesRouter.get('/services', async (req, res) => {
  try {
    const collection = db.collection('servicesList');

    const existing = await collection.countDocuments();
    if (existing === 0) {
      const services = servicesList(req).map((service) => ({
        ...service,
        _id: new ObjectId(String(service.id)),
        id: undefined,
      }));

      await collection.insertMany(services);
      return res.status(201).json(services);
    }

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

  console.log({ name, category, masters, last, options, cost, file });

  if (!file) return res.status(400).json({ error: 'File not founded' });

  const result = await imagesServiceSchema.validate(file);

  if (!result) return res.status(400).send({ error: 'File are not proper format' });

  const uniqueFilename = `${uId()}-${file.originalname.replace(/\s+/g, '_')}`;
  const filePath = path.join('images', 'services', uniqueFilename);

  await writeFile(filePath, file.buffer);

  const newService: Services = {
    id: generateId(req),
    name,
    image: getImageUrl(req, filePath),
    category,
    masters: JSON.parse(masters),
    last: JSON.parse(last),
    options: options ? JSON.parse(options) : [],
    cost: JSON.parse(cost),
  };

  servicesList(req).push(newService);

  console.log();

  return res.status(201).json(newService);
});

servicesRouter.put('/services/:id', serviceImageUpload.single('image'), async (req, res) => {
  const id = +req.params.id;
  const { name, category, last, masters, options, cost } = req.body;
  const updatedService = servicesList(req).find((el) => el.id === id);

  if (!updatedService) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const newFile = req.file;

  if (newFile) {
    const result = await imagesServiceSchema.validate(newFile);
    if (!result) {
      return res.status(400).send({ error: 'File is not in the proper format' });
    }

    try {
      if (updatedService.image?.startsWith(`${req.protocol}://${req.get('host')}/images/services/`)) {
        const oldPath = path.join(
          process.cwd(),
          updatedService.image.replace(`${req.protocol}://${req.get('host')}/`, '')
        );
        await unlink(oldPath);
      }
    } catch (e) {
      console.warn('Failed to delete old image:', e);
    }

    const filename = `${uId()}-${newFile.originalname.replace(/\s+/g, '_')}`;
    const newImagePath = path.join('images', 'services', filename);
    await writeFile(newImagePath, newFile.buffer);

    updatedService.image = getImageUrl(req, newImagePath);
  }

  Object.assign(updatedService, {
    name,
    image: getImageUrl(req, updatedService.image),
    category,
    masters: JSON.parse(masters),
    last: JSON.parse(last),
    options: options ? JSON.parse(options) : [],
    cost: JSON.parse(cost),
  });

  return res.status(200).json(updatedService);
});

servicesRouter.delete('/services/:id', async (req, res) => {
  const id = +req.params.id;
  const index = servicesList(req).findIndex((el) => el.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  try {
    if (servicesList(req)[index].image.startsWith(`${req.protocol}://${req.get('host')}/images/services/`)) {
      const filePath = path.join(
        process.cwd(),
        servicesList(req)[index].image.replace(`${req.protocol}://${req.get('host')}/`, '')
      );

      await unlink(filePath);
    }
  } catch (e) {
    console.warn('Failed to delete old image:', e);
  }

  servicesList(req).splice(index, 1);
  const mapped = responseService(req, servicesList(req));

  return res.status(200).json(mapped);
});

export default servicesRouter;
