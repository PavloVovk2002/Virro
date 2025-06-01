// backend/server/routes/authRoutes.ts

import express from 'express';
import { register, login, switchRole } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/switch-role', authenticate, asyncHandler(switchRole));

export default router;
