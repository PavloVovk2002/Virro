const DEV_MODE = true;

export const API_BASE_URL = DEV_MODE
  ? 'http://192.168.4.65:3001' // ← your computer’s local IP
  : 'https://your-production-api.com'; // ← change when deploying
