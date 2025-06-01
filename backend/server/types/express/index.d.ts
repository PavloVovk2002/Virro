//backend/server/types/epress/index.d.ts

import { TokenPayload } from '../../tokenPayload';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
