import { Request } from "express";
import { Services } from "../types/services.type";
import { MasterType } from "../types/masters.type";

export const getImageUrl = (req: Request, imageName: string) => {
  return imageName.startsWith(req.protocol)
    ? imageName.replaceAll("\\", "/")
    : `${req.protocol}://${req.get("host")}/${imageName}`.replaceAll("\\", "/");
};

export const responseService = <T extends Services | MasterType>(req: Request, arr: T[]) => {
  const finalList = arr.map((el) => ({ ...el, image: getImageUrl(req, el.image) }));

  return finalList;
};
