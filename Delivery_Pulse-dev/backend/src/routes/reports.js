import express from 'express';
// import { generateReports } from '../jobs/dailyReportJob.js';
import Report from '../models/Report.js';
import Project from '../models/Project.js';
import Employee from '../models/Employee.js';  // Import Employee model directly

const router = express.Router();

// Assume your auth middleware sets req.user (from session)
router.get('/download/:type/latest/:projectId', async (req, res) => {
  const { type, projectId } = req.params;
  if (!['daily', 'weekly'].includes(type)) {
    return res.status(400).send('Invalid type');
  }

  // Get current user (from your Microsoft OAuth session)
  const user = req.session?.user || req.user;  // Adjust based on your auth middleware
  if (!user?.email) {
    return res.status(401).send('Unauthorized');
  }

  // Fetch the employee's designation for THIS user (per request)
  const employee = await Employee.findOne({ 
    email: user.email.toLowerCase() 
  });

  if (!employee) {
    return res.status(403).send('Employee not found');
  }

  // Check designation
  const allowedDesignations = ['Manager', 'Admin', 'Director', 'Employee'];  // Adjust as needed
  if (!allowedDesignations.includes(employee.designation)) {
    return res.status(403).send('Forbidden: Insufficient designation');
  }

  // Find latest report
  const report = await Report.findOne({ project: projectId, type })
    .sort({ reportDate: -1 });

  if (!report) {
    return res.status(404).send('No report found');
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).send('Project not found');
  }

  const dateStr = report.reportDate.toISOString().split('T')[0];
  const filename = `${project.code}-${type}-report-${dateStr}.md`;

  res.setHeader('Content-Type', 'text/markdown');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(report.content);
});

// Protected route - only for testing/admins (fix the type param)
router.post('/trigger-daily', async (req, res) => {
  // Add admin check if needed
  try {
    await generateReports('daily');  // Fixed: was 'Manager', now 'daily'
    res.send('Daily reports triggered manually');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error triggering reports');
  }
});

// Optional: Add a separate trigger for weekly
router.post('/trigger-weekly', async (req, res) => {
  try {
    await generateReports('weekly');
    res.send('Weekly reports triggered manually');
  } catch (err) {
    res.status(500).send('Error');
  }
});

export default router;