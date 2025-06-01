// backend/server/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { TokenPayload } from '../types/tokenPayload';
import { RequestWithUser } from '../types/RequestWithUser';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No token provided');
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded &&
      'email' in decoded &&
      'role' in decoded
    ) {
      (req as RequestWithUser).user = decoded as TokenPayload;
      next();
    } else {
      console.log('❌ Invalid token payload');
      res.status(401).json({ error: 'Invalid token payload' });
    }
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      console.log('⛔️ Token expired');
      res.status(401).json({ error: 'Token expired' });
    } else {
      console.error('❌ JWT verification failed:', err.message);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}

export function requireVerifier(req: Request, res: Response, next: NextFunction): void {
  const user = (req as RequestWithUser).user;

  if (!user || user.role !== 'verifier') {
    res.status(403).json({ error: 'Access denied: Not a verifier' });
    return;
  }

  next();
}
