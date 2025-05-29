import express from 'express';
import { createGroupTask, getGroupTasks, updateGroupTask } from '../controllers/groupController.mjs';
import { authenticate, requireVerifier } from '../middleware/authMiddleware.mjs';
import { asyncHandler } from '../utils/asyncHandler.mjs';

const router = express.Router();

router.post('/', authenticate, asyncHandler(createGroupTask));
router.get('/', authenticate, asyncHandler(getGroupTasks));
router.put('/:id', authenticate, requireVerifier, asyncHandler(updateGroupTask));

export default router;

