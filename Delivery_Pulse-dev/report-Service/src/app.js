import express from 'express';
// import dotenv from 'dotenv';
import 'dotenv/config';
import connectDB from './config/db.js';
import reportRoutes from './routes/report.js';
import { startScheduler } from './jobs/scheduler.js';

// dotenv.config();

const app = express();
app.use(express.json());

// All report routes under /reports
app.use('/reports', reportRoutes);

// Start everything
async function start() {
  await connectDB();        // 1. Connect to MongoDB first
  startScheduler();         // 2. Start cron jobs
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`[App] Report service running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('[App] Failed to start:', err.message);
  process.exit(1);
});