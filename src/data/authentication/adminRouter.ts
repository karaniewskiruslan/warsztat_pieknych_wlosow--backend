import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '@config/mongo';
import { Users } from '@models/users.type';

dotenv.config();
const adminRouter = express.Router();

adminRouter.get('/login/me', (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    res.json({ user: decoded });
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
});

adminRouter.post('/login', async (req, res) => {
  const { login, password } = req.body;

  const collection = db.collection<Users>('usersList');
  const result = await collection.findOne({ user: login });

  if (!result || result.password !== password) {
    return res.status(401).json({ error: 'Dziś nie srasz' });
  }

  const token = jwt.sign(
    {
      role: 'admin',
      login,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '2h' },
  );

  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000,
  });

  const { password: _password, ...safeUser } = result;

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

export default adminRouter;
