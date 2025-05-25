import express from 'express';
import {
  createTask,
  getUserTasks,
  deleteTask,
  submitTask
} from '../controllers/taskController';
import { authenticate } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.use(authenticate);

router.get('/', asyncHandler(getUserTasks));
router.post('/', asyncHandler(createTask));
router.patch('/:id/submit', asyncHandler(submitTask));
router.delete('/:id', asyncHandler(deleteTask));

export default router;
