//backend/server/types/global.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    NODE_ENV?: 'development' | 'production';
  }
}
