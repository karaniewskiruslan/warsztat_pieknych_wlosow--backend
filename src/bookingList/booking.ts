import dotenv from "dotenv";
import express from "express";
import { Booking } from "../types/booking.type";
import { v4 as uId } from "uuid";

dotenv.config();
const bookingRouter = express.Router();

const bookingList: Booking[] = [];

bookingRouter.get("/booking", (_, res) => {
  res.status(200).send(bookingList);
});

bookingRouter.post("/booking", (req, res) => {
  const { fullName, email, service, master, date } = req.body;

  const newBooking: Booking = {
    id: uId(),
    fullName: fullName.trim(),
    email: email.trim(),
    service,
    master,
    date,
    isConfirmed: false,
  };

  bookingList.push(newBooking);

  res.status(201).send(newBooking);
});

bookingRouter.put("/booking/:id", (req, res) => {
  const id = req.params.id;
  const { isConfirmed } = req.body;
  const editedBooking = bookingList.find((el) => el.id === id)!;

  Object.assign(editedBooking, {
    isConfirmed: isConfirmed,
  });

  res.status(200).send(editedBooking);
});

bookingRouter.delete("/booking/:id", (req, res) => {
  const id = req.params.id;
  const index = bookingList.findIndex((el) => el.id === id);

  bookingList.splice(index, 1);

  res.status(200).send(bookingList);
});

export default bookingRouter;
