import app from './src/app.js';
import { initDb } from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  await initDb();

  app.listen(PORT, () => {
    console.log(`🚀 Expense Haven REST API Server running on port ${PORT}`);
    console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();
