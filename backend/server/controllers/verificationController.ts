import { Request, Response } from 'express';
import pool from '../models/db';

// Get list of tasks that need to be verified
export const getTasksToVerify = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE completed = true AND verified IS NULL`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks for verification' });
  }
};

// Approve a task
export const verifyTask = async (req: Request, res: Response) => {
  const verifierId = (req as any).user.userId;
  const { taskId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tasks SET verified = true, verified_by = $1
       WHERE id = $2 RETURNING *`,
      [verifierId, taskId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Task not found or already verified' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to verify task' });
  }
};
