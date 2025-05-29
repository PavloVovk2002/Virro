// backend/server/index.mts
import '../types/express'; // Force type pickup
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Now use CommonJS-style exports if you must
const app = express();
app.use(cors());
app.use(express.json());

// Import routes with require() still works
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const groupRoutes = require('./routes/groupRoutes');
const verificationRoutes = require('./routes/verificationRoutes');

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/groups', groupRoutes);
app.use('/verify', verificationRoutes);

export default app;


