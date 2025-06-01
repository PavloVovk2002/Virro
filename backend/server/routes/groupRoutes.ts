//backend/server/groupRoutes.ts

import express from 'express';
import { createGroupTask, getGroupTasks, updateGroupTask } from '../controllers/groupController';
import { authenticate, requireVerifier } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/', authenticate, asyncHandler(createGroupTask));
router.get('/', authenticate, asyncHandler(getGroupTasks));
router.put('/:id', authenticate, requireVerifier, asyncHandler(updateGroupTask));

export default router;

