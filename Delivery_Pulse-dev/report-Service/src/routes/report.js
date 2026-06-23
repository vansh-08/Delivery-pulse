import express from 'express';
import { generateReports } from '../services/reportGenerator.js';

const router = express.Router();

// Manually trigger report generation
// POST /reports/generate
// Body: { "type": "daily" } or { "type": "weekly" }
// Body: { "type": "daily", "projectId": "specific_project_id" }  ← optional
router.post('/generate', async (req, res) => {
  const { type, projectId } = req.body;

  if (!['daily', 'weekly'].includes(type)) {
    return res.status(400).json({ error: 'type must be "daily" or "weekly"' });
  }

  // Respond immediately — don't make the caller wait for Gemini
  res.status(202).json({
    message: `${type} report generation started`,
    type,
  });

  // Run in background
  generateReports(type, projectId || null).catch(err =>
    console.error('[Route] Background generation error:', err.message)
  );
});

// Health check — to verify service is running
// GET /reports/health
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'report-service',
    timestamp: new Date(),
  });
});

export default router;