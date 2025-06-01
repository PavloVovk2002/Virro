// backend/server/index.ts
console.log('✅ Importing express...');
import express from 'express';

console.log('✅ Importing cors...');
import cors from 'cors';

console.log('✅ Importing dotenv...');
import dotenv from 'dotenv';

console.log('✅ Importing path...');
import path from 'path';

console.log('✅ Loading environment variables...');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('✅ Importing authRoutes...');
import authRoutes from './routes/authRoutes';
console.log('✅ Importing taskRoutes...');
import taskRoutes from './routes/taskRoutes';
console.log('✅ Importing groupRoutes...');
import groupRoutes from './routes/groupRoutes';
console.log('✅ Importing verificationRoutes...');
import verificationRoutes from './routes/verificationRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/groups', groupRoutes);
app.use('/verify', verificationRoutes);

export default app;
