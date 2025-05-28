import { Request, Response } from 'express';
import pool from '../models/db';
import moment from 'moment';

// Create a new task (handles repeatDays)
export const createTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { title, due_date, description, repeatDays } = req.body;

  try {
    if (repeatDays && Array.isArray(repeatDays) && repeatDays.length > 0) {
      const createdTasks = [];

      for (const day of repeatDays) {
        const result = await pool.query(
          'INSERT INTO tasks (user_id, title, due_date, description, repeat_day) VALUES ($1, $2, NULL, $3, $4) RETURNING *',
          [userId, title, description || null, day]
        );
        createdTasks.push(result.rows[0]);
      }

      return res.status(201).json(createdTasks);
    } else {
      const result = await pool.query(
        'INSERT INTO tasks (user_id, title, due_date, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, title, due_date, description || null]
      );

      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error('Create task error:', err);
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

    const normalTasks = result.rows;

    const repeatResult = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 AND repeat_day IS NOT NULL',
      [userId]
    );

    const repeatTasks = repeatResult.rows;
    const upcomingRepeatTasks = [];
    const today = moment();

    for (const task of repeatTasks) {
      for (let i = 0; i < 28; i++) {
        const date = moment().add(i, 'days');
        const weekday = date.format('ddd');
        if (task.repeat_day === weekday) {
          upcomingRepeatTasks.push({
            ...task,
            due_date: date.format('YYYY-MM-DD'),
            virtual: true,
          });
        }
      }
    }

    const allTasks = [...normalTasks, ...upcomingRepeatTasks].sort((a, b) => {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

    res.json(allTasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Submit task for verification (completed = true)
export const submitTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tasks
       SET completed = true
       WHERE id = $1 AND user_id = $2 AND completed = false
       RETURNING *`,
      [id, userId]
    );

    if (!result.rows.length) {
      return res.status(400).json({ message: 'Task not found or already submitted' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Submit task error:', err);
    res.status(500).json({ message: 'Error submitting task' });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Task not found or already deleted' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
};
