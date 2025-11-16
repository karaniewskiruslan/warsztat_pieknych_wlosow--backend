import { getImageUrl } from "../helpers/helpers";
import { MasterType } from "../types/masters.type";
import { Request } from "express";

export const mastersInfo = (req: Request): MasterType[] => [
  {
    _id: 0,
    name: "Natalia",
    image: getImageUrl(req, "images/masters/Natalia/frontImage.webp"),
    profession: "Fryzier",
    experience: "30 lat doświadczenia",
    description: ["Lorem 11", "Lorem 12", "Lorem 13", "Lorem 14"],
    masterWorksPhotos: [
      getImageUrl(req, "images/masters/Natalia/Works/natalia.webp"),
      getImageUrl(req, "images/masters/Natalia/Works/natalia2.webp"),
      getImageUrl(req, "images/masters/Natalia/Works/natalia3.webp"),
      getImageUrl(req, "images/masters/Natalia/Works/natalia4.webp"),
      getImageUrl(req, "images/masters/Natalia/Works/natalia5.webp"),
      getImageUrl(req, "images/masters/Natalia/Works/natalia6.webp"),
      getImageUrl(req, "images/masters/Natalia/Works/natalia7.webp"),
      getImageUrl(req, "images/masters/Natalia/Works/natalia8.webp"),
    ],
    masterPhoto: getImageUrl(req, "images/masters/Natalia/Natalia.webp"),
  },
  {
    _id: 1,
    name: "Waleria",
    image: getImageUrl(req, "images/masters/Waleria/frontImage.webp"),
    profession: "Manicure | Pedicure",
    experience: "15 lat doświadczenia",
    description: ["Lorem 21", "Lorem 22", "Lorem 23", "Lorem 24"],
    masterWorksPhotos: [
      getImageUrl(req, "images/masters/Waleria/Works/waleria.webp"),
      getImageUrl(req, "images/masters/Waleria/Works/waleria2.webp"),
      getImageUrl(req, "images/masters/Waleria/Works/waleria3.webp"),
      getImageUrl(req, "images/masters/Waleria/Works/waleria4.webp"),
      getImageUrl(req, "images/masters/Waleria/Works/waleria5.webp"),
      getImageUrl(req, "images/masters/Waleria/Works/waleria6.webp"),
      getImageUrl(req, "images/masters/Waleria/Works/waleria7.webp"),
      getImageUrl(req, "images/masters/Waleria/Works/waleria8.webp"),
    ],
    masterPhoto: getImageUrl(req, "images/masters/Waleria/Waleria.webp"),
  },
];
