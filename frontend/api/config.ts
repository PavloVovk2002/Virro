// frontend/api/config.ts

const DEV_MODE = true;
const LOCAL_IP = '192.168.4.65';

export const API_BASE_URL = DEV_MODE
  ? `http://${LOCAL_IP}:3001`
  : 'https://your-production-api.com';
