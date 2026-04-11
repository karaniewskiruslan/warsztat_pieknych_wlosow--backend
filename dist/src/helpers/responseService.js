import { getImageUrl } from './getImageUrl';
export const responseService = (req, arr) => {
    const finalList = arr.map((el) => ({ ...el, image: getImageUrl(req, el.image) }));
    return finalList;
};
