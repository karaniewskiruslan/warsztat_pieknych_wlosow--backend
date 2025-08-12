import express, { Request } from "express";
import dotenv from "dotenv";
import { Services } from "../types/services.type";
import { servicesList } from "../initialData/services.data";
import { serviceImageUpload } from "../image-uploads/image-uploads";
import { imagesServiceSchema } from "../image-uploads/validate";
import { v4 as uId } from "uuid";
import path from "path";
import { unlink, writeFile } from "fs/promises";

dotenv.config();
const servicesRouter = express.Router();

const generateId = (): number => {
  return servicesList.length ? Math.max(...servicesList.map((s) => s.id)) + 1 : 1;
};

const getImageUrl = (req: Request, imageName: string) => {
  return imageName.startsWith(req.protocol)
    ? imageName.replaceAll("\\", "/")
    : `${req.protocol}://${req.get("host")}/${imageName}`.replaceAll("\\", "/");
};

const responseService = (req: Request, arr: Services[]) => {
  const finalList = arr.map((el) => ({ ...el, image: getImageUrl(req, el.image) }));

  return finalList;
};

servicesRouter.get("/services", (req, res) => {
  const mapped = responseService(req, servicesList);

  res.status(200).json(mapped);
});

servicesRouter.post("/services", serviceImageUpload.single("image"), async (req, res) => {
  const { name, category, options, cost } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "File not founded" });

  const result = await imagesServiceSchema.validate(file);

  if (!result) return res.status(400).send({ error: "File are not proper format" });

  const uniqueFilename = `${uId()}-${file.originalname.replace(/\s+/g, "_")}`;
  const filePath = path.join("images", "services", uniqueFilename);

  await writeFile(filePath, file.buffer);

  const newService: Services = {
    id: generateId(),
    name,
    image: getImageUrl(req, filePath),
    category,
    options: options ? JSON.parse(options) : [],
    cost: JSON.parse(cost),
  };

  servicesList.push(newService);

  return res.status(201).json(newService);
});

servicesRouter.put("/services/:id", serviceImageUpload.single("image"), async (req, res) => {
  const id = +req.params.id;
  const { name, category, options, cost } = req.body;
  const updatedService = servicesList.find((el) => el.id === id);

  if (!updatedService) {
    return res.status(404).json({ error: "Service not found" });
  }

  const newFile = req.file;

  if (newFile) {
    const result = await imagesServiceSchema.validate(newFile);
    if (!result) {
      return res.status(400).send({ error: "File is not in the proper format" });
    }

    try {
      if (updatedService.image?.startsWith(`${req.protocol}://${req.get("host")}/images/services/`)) {
        const oldPath = path.join(
          process.cwd(),
          updatedService.image.replace(`${req.protocol}://${req.get("host")}/`, "")
        );
        await unlink(oldPath);
      }
    } catch (e) {
      console.warn("Failed to delete old image:", e);
    }

    const filename = `${uId()}-${newFile.originalname.replace(/\s+/g, "_")}`;
    const newImagePath = path.join("images", "services", filename);
    await writeFile(newImagePath, newFile.buffer);

    updatedService.image = getImageUrl(req, newImagePath);
  }

  Object.assign(updatedService, {
    name,
    image: getImageUrl(req, updatedService.image),
    category,
    options: options ? JSON.parse(options) : [],
    cost: JSON.parse(cost),
  });

  return res.status(200).json(updatedService);
});

servicesRouter.delete("/services/:id", async (req, res) => {
  const id = +req.params.id;
  const index = servicesList.findIndex((el) => el.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Service not found" });
  }

  try {
    if (servicesList[index].image.startsWith(`${req.protocol}://${req.get("host")}/images/services/`)) {
      const filePath = path.join(
        process.cwd(),
        servicesList[index].image.replace(`${req.protocol}://${req.get("host")}/`, "")
      );

      await unlink(filePath);
    }
  } catch (e) {
    console.warn("Failed to delete old image:", e);
  }

  servicesList.splice(index, 1);
  const mapped = responseService(req, servicesList);

  return res.status(200).json(mapped);
});

export default servicesRouter;
