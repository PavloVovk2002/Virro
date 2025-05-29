import express from 'express';
import { createTask, getUserTasks, deleteTask, submitTask } from '../controllers/taskController.mjs';
import { authenticate } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.mjs';

const router = express.Router();

router.post('/', authenticate, asyncHandler(createTask));
router.get('/', authenticate, asyncHandler(getUserTasks));
router.delete('/:id', authenticate, asyncHandler(deleteTask));
router.put('/:id/submit', authenticate, asyncHandler(submitTask));

export default router;

