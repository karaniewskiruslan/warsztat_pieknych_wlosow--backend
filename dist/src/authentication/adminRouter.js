"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_1 = __importDefault(require("@config/mongo"));
dotenv_1.default.config();
const adminRouter = express_1.default.Router();
adminRouter.get('/login/me', (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.json({ user: decoded });
    }
    catch {
        res.status(403).json({ error: 'Invalid token' });
    }
});
adminRouter.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const collection = mongo_1.default.collection('usersList');
    const result = await collection.find({}).toArray();
    const proveUser = result.find((user) => user.user === login);
    if (!proveUser || proveUser.password !== password) {
        return res.status(401).json({ error: 'Dziś nie srasz' });
    }
    const token = jsonwebtoken_1.default.sign({
        role: 'admin',
        login,
    }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000,
    });
    const { password: _password, ...safeUser } = proveUser;
    res.json({ user: safeUser });
});
adminRouter.post('/logout', (_req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
    res.json({ message: 'Logged out' });
});
exports.default = adminRouter;
