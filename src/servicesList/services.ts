import express, { Request } from "express";
import dotenv from "dotenv";
import { Services } from "../types/services.type";
import { servicesList } from "../initialData/services.data";
import multer from "multer";

dotenv.config();
const servicesRouter = express.Router();

const generateId = (): number => {
  return servicesList.length ? Math.max(...servicesList.map((s) => s.id)) + 1 : 1;
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "images/services");
  },
  filename: (_req, file, cb) => {
    cb(null, `${file.originalname}-${generateId()}`);
  },
});
const upload = multer({ storage });

const getImageUrl = (req: Request, imageName: string) =>
  `${req.protocol}://${req.get("host")}/images/services/${imageName}`;

servicesRouter.get("/services", (req, res) => {
  const mapped = servicesList.map((el) => ({ ...el, image: getImageUrl(req, el.image) }));

  res.status(200).json(mapped);
});

servicesRouter.get("/services/:id", (req, res) => {
  const id: number = +req.params.id;
  const findedService = servicesList.find((el) => el.id === id);

  if (!findedService) {
    return res.status(404).json({ error: "Service not found" });
  }

  const responseService = {
    ...findedService,
    image: getImageUrl(req, findedService.image),
  };

  res.status(200).json(responseService);
});

servicesRouter.post("/services/", upload.single("image"), (req, res) => {
  const { name, category, options, cost } = req.body;

  if (!name || !category || !Array.isArray(options)) {
    return res.status(400).json({ error: "Invalid service data" });
  }
  const newId = generateId();
  const newService: Services = { id: newId, name, image: req.file?.filename!, category, options, cost };

  servicesList.push(newService);

  res.status(201).json(newService);
});

servicesRouter.put("/services/:id", upload.single("image"), (req, res) => {
  const id = +req.params.id;
  const { name, category, options, cost } = req.body;
  const updatedService = servicesList.find((el) => el.id === id);

  if (!updatedService) {
    return res.status(404).json({ error: "Service not found" });
  }

  Object.assign(updatedService, {
    name,
    image: req.file ? req.file?.filename : updatedService.image,
    category,
    options,
    cost,
  });

  res.status(200).json(updatedService);
});

servicesRouter.delete("/services/:id", (req, res) => {
  const id = +req.params.id;
  const index = servicesList.findIndex((el) => el.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Service not found" });
  }

  servicesList.splice(index, 1);
  res.status(200).json(servicesList);
});

export default servicesRouter;
