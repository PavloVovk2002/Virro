// constants/api.example.ts

// Toggle between development and production
const DEV_MODE = true;

// Replace this with your real dev API base URL
export const API_BASE_URL = DEV_MODE
  ? 'http://localhost:3001' // ← safe placeholder Replace: localhost with IPv4
  : 'https://your-production-api.com';
