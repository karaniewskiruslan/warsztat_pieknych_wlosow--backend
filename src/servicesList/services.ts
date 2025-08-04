import express from "express";
import dotenv from "dotenv";
import { Services } from "../types/services.type";
import { servicesList } from "../initialData/services.data";

dotenv.config();
const servicesRouter = express.Router();

const generateId = (): number => {
  return servicesList.length ? Math.max(...servicesList.map((s) => s.id)) + 1 : 1;
};

servicesRouter.get("/services", (_, res) => {
  res.status(200).json(servicesList);
});

servicesRouter.get("/services/:id", (req, res) => {
  const id: number = +req.params.id;
  const findedService = servicesList.find((el) => el.id === id);

  if (!findedService) {
    return res.status(404).json({ error: "Service not found" });
  }

  res.status(200).json(findedService);
});

servicesRouter.post("/services/", (req, res) => {
  const { name, image, category, options, cost } = req.body;

  if (!name || !image || !category || !Array.isArray(options)) {
    return res.status(400).json({ error: "Invalid service data" });
  }

  const newService: Services = { id: generateId(), name, image, category, options, cost };
  servicesList.push(newService);

  res.status(201).json(newService);
});

servicesRouter.put("/services/:id", (req, res) => {
  const id = +req.params.id;
  const { name, image, category, options, cost } = req.body;
  const updatedService = servicesList.find((el) => el.id === id);

  if (!updatedService) {
    return res.status(404).json({ error: "Service not found" });
  }

  Object.assign(updatedService, { name, image, category, options, cost });

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
