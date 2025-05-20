// index.ts - Entry point for the Express server
/// <reference types="node" />
import express from 'express';
import dontenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import groupRoutes from './routes/groupRoutes';
import verificationRoutes from './routes/verificationRoutes';

dontenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/groups', groupRoutes);
app.use('/verify', verificationRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

declare var process: {
  env: {
    [key: string]: string | undefined;
  };
};
