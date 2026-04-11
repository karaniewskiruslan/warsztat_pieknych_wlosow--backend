export const getImageUrl = (req, imageName) => {
    return imageName.startsWith(req.protocol)
        ? imageName.replaceAll('\\', '/')
        : `${req.protocol}://${req.get('host')}/${imageName}`.replaceAll('\\', '/');
};
