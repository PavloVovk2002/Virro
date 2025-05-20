import { Request, Response } from 'express';
import pool from '../models/db';

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { title, due_date, description } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, due_date, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, due_date, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Get tasks for current user
export const getUserTasks = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving tasks' });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { taskId } = req.params;
  const { title, due_date, description, completed } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, due_date = $2, description = $3, completed = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, due_date, description, completed, taskId, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { taskId } = req.params;

  try {
    await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting task' });
  }
};
