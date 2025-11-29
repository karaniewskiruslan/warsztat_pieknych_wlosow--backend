"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adminRouter = express_1.default.Router();
adminRouter.post('/login', (req, res) => {
    const { login, password } = req.body;
    const adminLog = process.env.ADMIN_LOGIN;
    const adminPass = process.env.ADMIN_PASSWORD;
    if (login !== adminLog || password !== adminPass) {
        return res.status(401).json({ error: 'Dziś nie srasz' });
    }
    const token = jsonwebtoken_1.default.sign({
        role: 'admin',
        login,
    }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
});
exports.default = adminRouter;
