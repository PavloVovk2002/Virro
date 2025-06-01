//backend/server/types/tokenPayload.d.ts

export interface TokenPayload {
  userId: number;
  email: string;
  role: 'user' | 'verifier';
}
