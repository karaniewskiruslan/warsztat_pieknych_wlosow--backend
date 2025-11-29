"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const mongo_1 = __importDefault(require("@config/mongo"));
const helpers_1 = require("@helpers/helpers");
const imageUploads_1 = require("@imageUpload/imageUploads");
dotenv_1.default.config();
const servicesRouter = express_1.default.Router();
servicesRouter.get('/services', async (_req, res) => {
    try {
        const collection = mongo_1.default.collection('serviceList');
        const result = await collection.find({}).toArray();
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).send({ error: 'Internal server error.' });
    }
});
servicesRouter.post('/services', imageUploads_1.serviceImageUpload.single('image'), async (req, res) => {
    const { name, category, masters, last, options, cost } = req.body;
    const file = req.file;
    console.log(req.body, file);
    if (!file)
        return res.status(400).json({ error: 'File not founded' });
    try {
        const uniqueFilename = `${(0, uuid_1.v4)()}-${file.originalname.replace(/\s+/g, '_')}`;
        const filePath = path_1.default.join('images', 'services', uniqueFilename);
        const collection = mongo_1.default.collection('serviceList');
        const newArray = await collection.find({}).toArray();
        await (0, promises_1.writeFile)(path_1.default.join(process.cwd(), filePath), file.buffer);
        const newService = {
            _id: newArray.length + 1,
            name,
            image: (0, helpers_1.getImageUrl)(req, filePath),
            category,
            masters: JSON.parse(masters),
            last: JSON.parse(last),
            options: options ? JSON.parse(options) : [],
            cost: JSON.parse(cost),
        };
        await collection.insertOne(newService);
        const inserted = await collection.findOne({ _id: newService._id });
        return res.status(201).json(inserted);
    }
    catch (err) {
        res.status(400).send({ error: 'Adding item error: ' + err });
    }
});
servicesRouter.put('/services/:id', imageUploads_1.serviceImageUpload.single('image'), async (req, res) => {
    const id = +req.params.id;
    const { name, category, last, masters, options, cost } = req.body;
    try {
        const collection = mongo_1.default.collection('serviceList');
        const existingService = await collection.findOne({ _id: id });
        if (!existingService) {
            return res.status(404).json({ error: 'Service not found' });
        }
        let imageUrl = existingService.image;
        const newFile = req.file;
        if (newFile) {
            const filename = `${(0, uuid_1.v4)()}-${newFile.originalname.replace(/\s+/g, '_')}`;
            const newImagePath = path_1.default.join(process.cwd(), 'images', 'services', filename);
            await (0, promises_1.writeFile)(newImagePath, newFile.buffer);
            imageUrl = (0, helpers_1.getImageUrl)(req, newImagePath);
            if (existingService.image?.startsWith(`${req.protocol}://${req.get('host')}/images/services/`)) {
                const oldPath = path_1.default.join(process.cwd(), existingService.image.replace(`${req.protocol}://${req.get('host')}/`, ''));
                await (0, promises_1.unlink)(oldPath).catch(() => console.warn('Failed to delete old image'));
            }
        }
        const updatedServiceData = {
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
    }
    catch (err) {
        res.status(400).send({ error: 'Update item error: ' + err });
    }
});
servicesRouter.delete('/services/:id', async (req, res) => {
    const id = +req.params.id;
    try {
        const collection = mongo_1.default.collection('serviceList');
        const service = await collection.findOne({ _id: id });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        if (service.image?.startsWith(`${req.protocol}://${req.get('host')}/images/services/`)) {
            const filePath = path_1.default.join(process.cwd(), service.image.replace(`${req.protocol}://${req.get('host')}/`, ''));
            await (0, promises_1.unlink)(filePath).catch(() => console.warn('Failed to delete old image'));
        }
        const result = await collection.deleteOne({ _id: id });
        return res.status(200).json({ success: true, deleted: result.deletedCount > 0 });
    }
    catch (err) {
        res.status(400).json({ error: 'Delete item error: ' + err });
    }
});
exports.default = servicesRouter;
