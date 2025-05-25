// backend/server/index.ts

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import groupRoutes from './routes/groupRoutes';
import verificationRoutes from './routes/verificationRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/groups', groupRoutes);
app.use('/verify', verificationRoutes);

export default app;
