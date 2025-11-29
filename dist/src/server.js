"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminRouter_1 = __importDefault(require("./authentication/adminRouter"));
const servicesRouter_1 = __importDefault(require("@data/services/servicesRouter"));
const bookingRouter_1 = __importDefault(require("@data/booking/bookingRouter"));
const mastersRouter_1 = __importDefault(require("@data/masters/mastersRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', adminRouter_1.default);
app.use('/api', servicesRouter_1.default);
app.use('/api', bookingRouter_1.default);
app.use('/api', mastersRouter_1.default);
app.use('/images/', express_1.default.static('images'));
app.get('/', (_req, res) => {
    res.send('Witaj w Warsztata Pięknych włosów, część serwerowa');
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
