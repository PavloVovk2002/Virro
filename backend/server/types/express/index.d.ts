import { TokenPayload } from '../tokenPayload';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

