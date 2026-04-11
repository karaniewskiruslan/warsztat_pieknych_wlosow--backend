import { Request } from 'express';

export const getImageUrl = (req: Request, imageName: string) => {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

  return imageName.startsWith('http')
    ? imageName.replaceAll('\\', '/')
    : `${baseUrl}/${imageName}`.replaceAll('\\', '/');
};
