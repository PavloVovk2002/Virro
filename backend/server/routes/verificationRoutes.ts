//backend/server/verificationRoutes.ts

import express from 'express';
import { getTasksToVerify, approveTask, rejectTask } from '../controllers/verificationController';
import { authenticate, requireVerifier } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.get('/', authenticate, requireVerifier, asyncHandler(getTasksToVerify));
router.put('/:id/approve', authenticate, requireVerifier, asyncHandler(approveTask));
router.put('/:id/reject', authenticate, requireVerifier, asyncHandler(rejectTask));

export default router;
