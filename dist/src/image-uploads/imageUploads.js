"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceImageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
exports.serviceImageUpload = (0, multer_1.default)({
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/') &&
            ['png', 'jpeg', 'webp', 'svg+xml'].some((type) => file.mimetype.endsWith(type))) {
            cb(null, true);
        }
        else {
            cb(new Error('Unaccepted file type'));
        }
    },
    storage: multer_1.default.memoryStorage(),
});
