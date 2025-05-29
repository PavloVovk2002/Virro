// backend/server.ts

require('dotenv').config(); // ✅ Inline to avoid redeclaration

const server = require('./server/index'); // ✅ Renamed from app → server

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});




