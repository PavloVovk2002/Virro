export interface TokenPayload {
  userId: number;
  email: string;
  role: 'user' | 'verifier';
}
