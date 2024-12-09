import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';
import jwt from 'jsonwebtoken';
import { TestResult } from './models/TestResult.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

app.use('/api/auth', authRoutes);

app.post("/api/results", auth, async (req, res) => {
  try {
    const result = await TestResult.create({
      ...req.body,
      userId: req.userId
    });
    console.log('New test result saved:', result);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/results", auth, async (req, res) => {
  try {
    const results = await TestResult.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
