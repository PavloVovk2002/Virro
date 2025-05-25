// backend/index.ts – Entry point to start the Express server

import * as dotenv from 'dotenv';
import app from './server';

// Load environment variables from .env
dotenv.config();

// Set port from environment or default to 3001
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
