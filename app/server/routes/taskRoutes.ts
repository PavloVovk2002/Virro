import express from 'express';
import{
  createTask,
  getUserTasks,
  updateTask,
  deleteTask
} from '../controllers/taskController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.post('/', createTask);
router.get('/', getUserTasks);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;