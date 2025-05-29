import { Request, Response } from 'express';
import pool from '../models/db.mjs';
import { generateToken } from '../utils/jwt.mjs';

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, role, email',
      [email, password, role]
    );
    const user = result.rows[0];
    const token = generateToken({ userId: user.id, role: user.role, email: user.email });
    res.status(201).json({ token });
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user.id, role: user.role, email: user.email });
    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const switchRole = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { newRole } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, role, email',
      [newRole, userId]
    );
    const user = result.rows[0];
    const token = generateToken({ userId: user.id, role: user.role, email: user.email });
    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Role switch failed' });
  }
};
