import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRouter from './authentication/adminRouter';
import servicesRouter from './data/services/servicesRouter';
import bookingRouter from './data/booking/bookingRouter';
import mastersRouter from './data/masters/mastersRouter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', adminRouter);
app.use('/api', servicesRouter);
app.use('/api', bookingRouter);
app.use('/api', mastersRouter);
app.use('/images/', express.static('images'));

app.get('/', (_req, res) => {
  res.send('Witaj w Warsztata Pięknych włosów, część serwerowa');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
