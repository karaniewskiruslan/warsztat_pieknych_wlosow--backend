import dotenv from 'dotenv';
import express from 'express';
import { v4 as uId } from 'uuid';
import { Booking } from '@models/booking.type';
import db from '@config/mongo';
import { transporter } from '@mailer/mailerInit';

dotenv.config();
const bookingRouter = express.Router();

bookingRouter.get('/booking', async (_, res) => {
  try {
    const collection = db.collection<Booking>('bookingList');
    const result = await collection.find({}).toArray();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: 'Internal server error.' });
  }
});

bookingRouter.post('/booking', async (req, res) => {
  const { fullName, email, service, last, master, date } = req.body;

  const newBooking: Booking = {
    _id: uId(),
    fullName: fullName.trim(),
    email: email.trim(),
    service,
    last,
    master,
    date,
    isConfirmed: false,
  };

  try {
    const collection = db.collection<Booking>('bookingList');
    await collection.insertOne(newBooking);

    const inserted = await collection.findOne({ _id: newBooking._id });

    await transporter.sendMail({
      from: `"Warsztat pięknych włosów" <${process.env.TEST_EMAIL}>`,
      to: `${newBooking.fullName} <${newBooking.email}>`,
      subject: `Rezerwacja wizyty ${newBooking._id.slice(0, 8)}`,
      text: `Cześć, ${newBooking.fullName}.
      Twoja wizyta została zapisana. Czekaj na jej potwierdzenie ze strony admina`,
    });

    return res.status(201).json(inserted);
  } catch (err) {
    res.status(400).send({ error: 'Adding item error: ' + err });
  }
});

bookingRouter.put('/booking/:id', async (req, res) => {
  const id = req.params.id;
  const { isConfirmed } = req.body;

  try {
    const collection = db.collection<Booking>('bookingList');
    await collection.updateOne({ _id: id }, { $set: { isConfirmed } });
    const editedBooking = await collection.findOne({ _id: id });

    if (!editedBooking) {
      return res.status(404).send({ error: 'Booking not found' });
    }

    await transporter.sendMail({
      from: `"Warsztat pięknych włosów" <${process.env.TEST_EMAIL}>`,
      to: `${editedBooking.fullName} <${editedBooking.email}>`,
      subject: `Wizyta ${editedBooking._id.slice(0, 8)} została potwierdzona`,
      text: `Cześć, ${editedBooking.fullName}.
      Twoja wizyta została zaakceptowana`,
    });

    return res.status(200).json(editedBooking);
  } catch (err) {
    res.status(400).send({ error: 'Update item error: ' + err });
  }
});

bookingRouter.delete('/booking/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const collection = db.collection<Booking>('bookingList');
    const result = await collection.deleteOne({ _id: id });

    return res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Delete item error: ' + err });
  }
});

export default bookingRouter;
