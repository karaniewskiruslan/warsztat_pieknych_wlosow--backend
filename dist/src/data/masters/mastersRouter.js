"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("@config/mongo"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const mastersRouter = express_1.default.Router();
mastersRouter.get('/masters', async (_req, res) => {
    try {
        const collection = mongo_1.default.collection('masterList');
        const result = await collection.find({}).toArray();
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).send({ error: 'Internal server error: ' + err });
    }
});
exports.default = mastersRouter;
