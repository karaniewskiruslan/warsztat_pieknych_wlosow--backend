import { Request } from 'express';

export const getImageUrl = (req: Request, imageName: string) => {
  return imageName.startsWith(req.protocol)
    ? imageName.replaceAll('\\', '/')
    : `${req.protocol}://${req.get('host')}/${imageName}`.replaceAll('\\', '/');
};
