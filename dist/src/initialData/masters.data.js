"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mastersInfo = void 0;
const helpers_1 = require("@helpers/helpers");
const mastersInfo = (req) => [
    {
        _id: 0,
        name: 'Natalia',
        profession: ['Fryzier'],
        experience: 30,
        description: ['Lorem 11', 'Lorem 12', 'Lorem 13', 'Lorem 14'],
        masterWorksPhotos: [
            (0, helpers_1.getImageUrl)(req, 'images/masters/Natalia/Works/natalia.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Natalia/Works/natalia2.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Natalia/Works/natalia3.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Natalia/Works/natalia4.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Natalia/Works/natalia5.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Natalia/Works/natalia6.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Natalia/Works/natalia7.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Natalia/Works/natalia8.webp'),
        ],
        image: (0, helpers_1.getImageUrl)(req, 'images/masters/Natalia/frontImage.webp'),
    },
    {
        _id: 1,
        name: 'Waleria',
        profession: ['Manicure', 'Pedicure'],
        experience: 15,
        description: ['Lorem 21', 'Lorem 22', 'Lorem 23', 'Lorem 24'],
        masterWorksPhotos: [
            (0, helpers_1.getImageUrl)(req, 'images/masters/Waleria/Works/waleria.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Waleria/Works/waleria2.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Waleria/Works/waleria3.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Waleria/Works/waleria4.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Waleria/Works/waleria5.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Waleria/Works/waleria6.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Waleria/Works/waleria7.webp'),
            (0, helpers_1.getImageUrl)(req, 'images/masters/Waleria/Works/waleria8.webp'),
        ],
        image: (0, helpers_1.getImageUrl)(req, 'images/masters/Waleria/frontImage.webp'),
    },
];
exports.mastersInfo = mastersInfo;
