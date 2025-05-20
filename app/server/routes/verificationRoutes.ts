import express from 'express';
import { getTasksToVerify, verifyTask } from '../controllers/verificationController';
import { authenticate, requireVerifier } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.use(authenticate);
router.use(requireVerifier);

router.get('/pending', asyncHandler(getTasksToVerify));
router.post('/:taskId/approve', asyncHandler(verifyTask));

export default router;
