import { MasterType } from '@models/masters.type';
import { Services } from '@models/services.type';
import { Request } from 'express';

export const getImageUrl = (req: Request, imageName: string) => {
  return imageName.startsWith(req.protocol)
    ? imageName.replaceAll('\\', '/')
    : `${req.protocol}://${req.get('host')}/${imageName}`.replaceAll('\\', '/');
};

export const responseService = <T extends Services | MasterType>(req: Request, arr: T[]) => {
  const finalList = arr.map((el) => ({ ...el, image: getImageUrl(req, el.image) }));

  return finalList;
};
