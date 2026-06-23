
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const reportSchema = require('../prompts/reportSchema.json');

import Project from '../models/Project.js';
import DSR from '../models/DSR.js';
import Report from '../models/Report.js';
import '../models/Employee.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.3,
    topP: 0.8,
    maxOutputTokens: 4096,
  },
});

// ── Get correct date range based on report type ──────────────────────────────
function getDateRange(type) {
  const today = new Date();

  if (type === 'daily') {
    const yesterday = new Date(Date.UTC(
      today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 1
    ));
    return { reportDate: yesterday, startDate: yesterday, endDate: yesterday };
  }

  if (type === 'weekly') {
    const currentDay = today.getUTCDay();
    const daysToSunday = currentDay === 0 ? 7 : currentDay;
    const sunday = new Date(Date.UTC(
      today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - daysToSunday
    ));
    const monday = new Date(sunday);
    monday.setUTCDate(sunday.getUTCDate() - 6);
    return { reportDate: sunday, startDate: monday, endDate: sunday };
  }

  throw new Error(`Unknown report type: ${type}`);
}

// ── Build a clean structured prompt for the LLM ──────────────────────────────
function buildPrompt(type, project, dsrs, startDate, endDate, reportDate) {
  const dateLabel = type === 'daily'
    ? `Date: ${reportDate.toISOString().split('T')[0]}`
    : `Week: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`;

  // Group DSR entries by employee name
  const byEmployee = {};
  for (const dsr of dsrs) {
    const name = dsr.employee_id?.name || 'Unknown';
    const designation = dsr.employee_id?.designation || 'N/A';
    if (!byEmployee[name]) byEmployee[name] = { designation, entries: [] };
    byEmployee[name].entries.push(dsr);
  }

  const employeeSection = Object.entries(byEmployee).map(([name, data]) => {
    const entries = data.entries.map(dsr => {
      const date = dsr.dsr_date.toISOString().split('T')[0];
      return `
    [${date}]
    - Completed : ${dsr.tasks_today.length ? dsr.tasks_today.join('; ') : 'Nothing reported'}
    - Planned   : ${dsr.tasks_tomorrow.length ? dsr.tasks_tomorrow.join('; ') : 'Nothing reported'}
    - Blockers  : ${dsr.blockers.length ? dsr.blockers.join('; ') : 'None'}
    - Notes     : ${dsr.notes?.trim() || 'None'}`;
    }).join('\n');
    return `  ${name} (${data.designation}):\n${entries}`;
  }).join('\n\n');

  return `You are a senior project manager writing a formal ${type} status report.

PROJECT CONTEXT:
- Name : ${project.name}
- Code : ${project.code}
- ${dateLabel}

DAILY STATUS REPORTS FROM TEAM:
${employeeSection}

INSTRUCTIONS:
- Do NOT make up anything not present in the DSR data above.
- Write in third person (e.g. "The team completed..." not "We completed...").
- Identify patterns across team members (e.g., multiple blockers on same issue).
- Flag unresolved blockers with isUnresolved: true.
- Return ONLY a valid JSON object. No markdown, no explanation, no code fences.

Return EXACTLY this JSON structure:
${JSON.stringify(reportSchema, null, 2)}
`;
}

// ── Main function — generates reports for all active projects ─────────────────
export async function generateReports(type, projectIdFilter = null) {
  console.log(`[ReportService] Starting ${type} report generation...`);

  const { reportDate, startDate, endDate } = getDateRange(type);

  const query = { status: 'active' };
  if (projectIdFilter) query._id = projectIdFilter;

  const projects = await Project.find(query);
  const results = { success: [], failed: [], skipped: [] };

  for (const project of projects) {
    try {
      const dsrs = await DSR.find({
        project_id: project._id,
        dsr_date: { $gte: startDate, $lte: endDate },
      }).populate('employee_id', 'name designation');

      if (dsrs.length === 0) {
        console.log(`[ReportService] No DSRs found — skipping ${project.name}`);
        results.skipped.push(project.name);
        continue;
      }

      const prompt = buildPrompt(type, project, dsrs, startDate, endDate, reportDate);
      const result = await model.generateContent(prompt);

// ── Step 4: Parse JSON response ──────────────────────────────
const raw = result.response.text();
const cleaned = raw.replace(/```json|```/g, '').trim(); // safety cleanup
const content = JSON.parse(cleaned); // now it's a proper object ✅


console.log('[DEBUG] content to save:', JSON.stringify(content, null, 2));

console.log('[DEBUG] raw from Gemini:', raw);


await Report.findOneAndUpdate(
  { project: project._id, type, reportDate },
  {
    content,   // stored as object in DB, not plain text
    generatedAt: new Date(),
    dsrCount: dsrs.length,
    employeeCount: [...new Set(dsrs.map(d => String(d.employee_id?._id)))].length,
  },
  { upsert: true, new: true }
);
      console.log(`[ReportService] ✅ Report saved — ${project.name}`);
      results.success.push(project.name);

    } catch (err) {
      console.error(`[ReportService] ❌ Failed — ${project.name}:`, err.message);
      results.failed.push({ project: project.name, error: err.message });
    }
  }

  console.log(`[ReportService] Done. ✅ ${results.success.length} | ❌ ${results.failed.length} | ⏭️ ${results.skipped.length}`);
  return results;
}
