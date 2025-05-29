import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.mjs';
import { TokenPayload } from '../types/tokenPayload.js';
import { RequestWithUser } from '../types/RequestWithUser.js';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    // Runtime validation to ensure decoded matches TokenPayload structure
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
      res.status(401).json({ error: 'Invalid token payload' });
    }
  } catch {
    res.status(401).json({ error: 'Invalid token' });
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
