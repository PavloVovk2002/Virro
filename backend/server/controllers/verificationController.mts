import { Request, Response } from 'express';
import pool from '../models/db.mjs';

export const getTasksToVerify = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE submitted = true AND verified IS NULL ORDER BY due_date ASC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks to verify:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const approveTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tasks SET verified = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task approved successfully' });
  } catch (err) {
    console.error('Error approving task:', err);
    res.status(500).json({ error: 'Failed to approve task' });
  }
};

export const rejectTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tasks SET submitted = false WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task rejected and reset to unsubmitted' });
  } catch (err) {
    console.error('Error rejecting task:', err);
    res.status(500).json({ error: 'Failed to reject task' });
  }
};
