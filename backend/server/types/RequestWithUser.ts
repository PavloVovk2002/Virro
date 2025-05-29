import { Request } from 'express';
import { TokenPayload } from './tokenPayload';

export interface RequestWithUser extends Omit<Request, 'user'> {
  user?: TokenPayload;
}
