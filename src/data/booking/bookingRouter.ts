import dotenv from 'dotenv';
import express from 'express';
import { Booking } from '../../types/booking.type';
import { v4 as uId } from 'uuid';
import { transporter } from '../../mailer/mailerInit';

dotenv.config();
const bookingRouter = express.Router();

const bookingList: Booking[] = [];

bookingRouter.get('/booking', (_, res) => {
  res.status(200).send(bookingList);
});

bookingRouter.post('/booking', async (req, res) => {
  const { fullName, email, service, last, master, date } = req.body;

  const newBooking: Booking = {
    id: uId(),
    fullName: fullName.trim(),
    email: email.trim(),
    service,
    last,
    master,
    date,
    isConfirmed: false,
  };

  bookingList.push(newBooking);

  try {
    await transporter.sendMail({
      from: `"Warsztat pięknych włosów" <${process.env.TEST_EMAIL}>`,
      to: `${newBooking.fullName} <${newBooking.email}>`,
      subject: `Rezerwacja wizyty ${newBooking.id.slice(0, 8)}`,
      text: `Cześć, ${newBooking.fullName}.
      Twoja wizyta została zapisana. Czekaj na jej potwierdzenie ze strony admina`,
    });

    res.status(201).send(newBooking);
  } catch (err) {
    console.error('Błąd wysyłki emaila:', err);
    res.status(201).send({
      ...newBooking,
      emailError: 'Nie udało się wysłać potwierdzenia na email',
    });
  }
});

bookingRouter.put('/booking/:id', async (req, res) => {
  const id = req.params.id;
  const { isConfirmed } = req.body;
  const editedBooking = bookingList.find((el) => el.id === id)!;

  Object.assign(editedBooking, {
    isConfirmed: isConfirmed,
  });

  try {
    await transporter.sendMail({
      from: `"Warsztat pięknych włosów" <${process.env.TEST_EMAIL}>`,
      to: `${editedBooking.fullName} <${editedBooking.email}>`,
      subject: `Wizyta ${editedBooking.id.slice(0, 8)} została potwierdzona`,
      text: `Cześć, ${editedBooking.fullName}.
      Twoja wizyta została zaakceptowana`,
    });

    res.status(200).send(editedBooking);
  } catch (e) {
    console.error('Błąd wysyłki emaila:', e);
    res.status(200).send({
      ...editedBooking,
      emailError: 'Nie udało się wysłać akceptacji na email',
    });
  }
});

bookingRouter.delete('/booking/:id', (req, res) => {
  const id = req.params.id;
  const index = bookingList.findIndex((el) => el.id === id);

  bookingList.splice(index, 1);

  res.status(200).send(bookingList);
});

export default bookingRouter;
