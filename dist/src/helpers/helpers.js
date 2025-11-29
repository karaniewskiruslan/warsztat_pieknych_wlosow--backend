"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseService = exports.getImageUrl = void 0;
const getImageUrl = (req, imageName) => {
    return imageName.startsWith(req.protocol)
        ? imageName.replaceAll('\\', '/')
        : `${req.protocol}://${req.get('host')}/${imageName}`.replaceAll('\\', '/');
};
exports.getImageUrl = getImageUrl;
const responseService = (req, arr) => {
    const finalList = arr.map((el) => ({ ...el, image: (0, exports.getImageUrl)(req, el.image) }));
    return finalList;
};
exports.responseService = responseService;
