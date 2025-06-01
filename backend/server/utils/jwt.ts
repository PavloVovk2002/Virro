//backend/server/utils/jwt.ts

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { TokenPayload } from '../types/tokenPayload.js';

dotenv.config();

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error('❌ JWT_SECRET is not defined in environment variables');
}
const JWT_SECRET = rawSecret as jwt.Secret;

// Generate token with strong type safety
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify token with proper narrowing
export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (
    typeof decoded === 'object' &&
    decoded !== null &&
    'userId' in decoded &&
    'email' in decoded &&
    'role' in decoded
  ) {
    return decoded as TokenPayload;
  }

  throw new Error('Invalid token payload');
}
