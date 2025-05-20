import express from 'express';
import {
  createGroupTask,
  getGroupTasks,
  updateGroupTask
} from '../controllers/groupController';
import { authenticate, requireVerifier } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);
router.use(requireVerifier);

router.post('/', createGroupTask);
router.get('/', getGroupTasks);
router.put('/:groupTaskId', updateGroupTask);

export default router;