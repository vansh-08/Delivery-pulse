import cron from 'node-cron';
import { generateReports } from '../services/reportGenerator.js';

export function startScheduler() {
  // Runs every day at 8:50 PM IST
  cron.schedule('50 20 * * *', () => {
    console.log('[Scheduler] Triggering daily report...');
    generateReports('daily').catch(err =>
      console.error('[Scheduler] Daily job error:', err.message)
    );
  }, { timezone: 'Asia/Kolkata' });

  // Runs every Sunday at 8:50 PM IST
  cron.schedule('50 20 * * 0', () => {
    console.log('[Scheduler] Triggering weekly report...');
    generateReports('weekly').catch(err =>
      console.error('[Scheduler] Weekly job error:', err.message)
    );
  }, { timezone: 'Asia/Kolkata' });

  console.log('[Scheduler] ✅ Daily job → 8:50 PM IST every day');
  console.log('[Scheduler] ✅ Weekly job → 8:50 PM IST every Sunday');
}