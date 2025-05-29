// /frontend/constants/api.ts

// Toggle between development and production
const DEV_MODE = true;

export const API_BASE_URL = DEV_MODE
  ? 'http://192.168.1.100:3001' // ← Replace this with your actual IPv4 address from `ipconfig`
  : 'https://your-production-api.com';

