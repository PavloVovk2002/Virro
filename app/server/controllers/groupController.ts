import { Request, Response } from 'express';
import pool from '../models/db';

// Create a group task
export const createGroupTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { group_name, title, due_date, description } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO group_tasks (created_by, group_name, title, due_date, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, group_name, title, due_date, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create group task' });
  }
};

// Get all group tasks the user is part of
export const getGroupTasks = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const result = await pool.query(
      `SELECT gt.* FROM group_tasks gt
       JOIN group_members gm ON gt.group_name = gm.group_name
       WHERE gm.user_id = $1
       ORDER BY gt.due_date ASC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch group tasks' });
  }
};

// Update a group task
export const updateGroupTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { groupTaskId } = req.params;
  const { title, due_date, description, completed } = req.body;

  try {
    const result = await pool.query(
      `UPDATE group_tasks
       SET title = $1, due_date = $2, description = $3, completed = $4
       WHERE id = $5 AND created_by = $6
       RETURNING *`,
      [title, due_date, description, completed, groupTaskId, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update group task' });
  }
};
