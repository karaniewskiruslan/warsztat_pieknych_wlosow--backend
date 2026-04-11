import { MasterType } from '@models/masters.type';
import { Services } from '@models/services.type';
import { getImageUrl } from './getImageUrl';
import { Request } from 'express';

export const responseService = <T extends Services | MasterType>(req: Request, arr: T[]) => {
  const finalList = arr.map((el) => ({ ...el, image: getImageUrl(req, el.image) }));

  return finalList;
};
