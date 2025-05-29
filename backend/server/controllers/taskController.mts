import { Request, Response } from 'express';
import pool from '../models/db.mjs';

export const createTask = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { title, due_date, repeat_days } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, due_date, repeat_days, completed)
       VALUES ($1, $2, $3, $4, false)
       RETURNING *`,
      [userId, title, due_date, repeat_days]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const getUserTasks = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const submitTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const result = await pool.query(
      `UPDATE tasks SET submitted = true WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error submitting task:', err);
    res.status(500).json({ error: 'Failed to submit task' });
  }
};
