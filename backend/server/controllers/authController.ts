// backend/server/controllers/authController.ts

/// <reference path="../types/express/index.d.ts" />

import { Request, Response } from 'express';
import pool from '../models/db';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

// Registration Handler
export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, role, email',
      [email, hashedPassword, role]
    );

    const user = result.rows[0];
    const token = generateToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    res.status(201).json({ token });
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
};

// Login Service Function
export const loginService = async (email: string, password: string) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
};

// New Login Handler
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await loginService(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: 'Login successful.',
      token,
      user,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Switch Role Handler
export const switchRole = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { newRole } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, role, email',
      [newRole, userId]
    );

    const user = result.rows[0];
    const token = generateToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Role switch failed' });
  }
};
