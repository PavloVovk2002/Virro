import { Request, Response } from 'express';
import pool from '../models/db.mjs';

export const createGroupTask = async (req: Request, res: Response) => {
  const { group_name, description, due_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO group_tasks (group_name, description, due_date)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [group_name, description, due_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating group task:', err);
    res.status(500).json({ error: 'Failed to create group task' });
  }
};

export const getGroupTasks = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM group_tasks ORDER BY due_date ASC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error getting group tasks:', err);
    res.status(500).json({ error: 'Failed to retrieve group tasks' });
  }
};

export const updateGroupTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { group_name, description, due_date, progress } = req.body;

  try {
    const result = await pool.query(
      `UPDATE group_tasks
       SET group_name = $1, description = $2, due_date = $3, progress = $4
       WHERE id = $5
       RETURNING *`,
      [group_name, description, due_date, progress, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Group task not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating group task:', err);
    res.status(500).json({ error: 'Failed to update group task' });
  }
};
