"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const mongo_1 = __importDefault(require("@config/mongo"));
const mailerInit_1 = require("@mailer/mailerInit");
dotenv_1.default.config();
const bookingRouter = express_1.default.Router();
bookingRouter.get('/booking', async (_, res) => {
    try {
        const collection = mongo_1.default.collection('bookingList');
        const result = await collection.find({}).toArray();
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).send({ error: 'Internal server error.' });
    }
});
bookingRouter.post('/booking', async (req, res) => {
    const { fullName, email, service, last, master, date } = req.body;
    const newBooking = {
        _id: (0, uuid_1.v4)(),
        fullName: fullName.trim(),
        email: email.trim(),
        service,
        last,
        master,
        date,
        isConfirmed: false,
    };
    try {
        const collection = mongo_1.default.collection('bookingList');
        await collection.insertOne(newBooking);
        const inserted = await collection.findOne({ _id: newBooking._id });
        await mailerInit_1.transporter.sendMail({
            from: `"Warsztat pięknych włosów" <${process.env.TEST_EMAIL}>`,
            to: `${newBooking.fullName} <${newBooking.email}>`,
            subject: `Rezerwacja wizyty ${newBooking._id.slice(0, 8)}`,
            text: `Cześć, ${newBooking.fullName}.
      Twoja wizyta została zapisana. Czekaj na jej potwierdzenie ze strony admina`,
        });
        return res.status(201).json(inserted);
    }
    catch (err) {
        res.status(400).send({ error: 'Adding item error: ' + err });
    }
});
bookingRouter.put('/booking/:id', async (req, res) => {
    const id = req.params.id;
    const { isConfirmed } = req.body;
    try {
        const collection = mongo_1.default.collection('bookingList');
        await collection.updateOne({ _id: id }, { $set: { isConfirmed } });
        const editedBooking = await collection.findOne({ _id: id });
        if (!editedBooking) {
            return res.status(404).send({ error: 'Booking not found' });
        }
        await mailerInit_1.transporter.sendMail({
            from: `"Warsztat pięknych włosów" <${process.env.TEST_EMAIL}>`,
            to: `${editedBooking.fullName} <${editedBooking.email}>`,
            subject: `Wizyta ${editedBooking._id.slice(0, 8)} została potwierdzona`,
            text: `Cześć, ${editedBooking.fullName}.
      Twoja wizyta została zaakceptowana`,
        });
        return res.status(200).json(editedBooking);
    }
    catch (err) {
        res.status(400).send({ error: 'Update item error: ' + err });
    }
});
bookingRouter.delete('/booking/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const collection = mongo_1.default.collection('bookingList');
        const result = await collection.deleteOne({ _id: id });
        return res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ error: 'Delete item error: ' + err });
    }
});
exports.default = bookingRouter;
