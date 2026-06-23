// import cron from 'node-cron';
// import Project from '../models/Project.js';
// import DSR from '../models/DSR.js';
// import Report from '../models/Report.js';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// // import {VertexAI} from "@google"

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// export async function generateReports(type) {  // 'daily' or 'weekly'
//   console.log(`Starting ${type} report generation...`);

//   const today = new Date();
//   let reportDate, startDate, endDate;

//   if (type === 'daily') {
//     // Yesterday
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);
//     reportDate = startDate = endDate = new Date(Date.UTC(
//       yesterday.getUTCFullYear(),
//       yesterday.getUTCMonth(),
//       yesterday.getUTCDate()
//     ));
//     console.log(`Generating daily reports for ${reportDate.toISOString().split('T')[0]}`);
//   } else if (type === 'weekly') {
//     // Previous week: Find last Sunday as end, Monday as start
//     const currentDay = today.getUTCDay();  // 0 = Sunday
//     const daysToSunday = currentDay === 0 ? 7 : currentDay;  // If today is Sunday, go back 7 days
//     const sunday = new Date(today);
//     sunday.setDate(today.getDate() - daysToSunday);
//     endDate = reportDate = new Date(Date.UTC(sunday.getUTCFullYear(), sunday.getUTCMonth(), sunday.getUTCDate()));

//     const monday = new Date(endDate);
//     monday.setDate(endDate.getDate() - 6);  // 6 days before Sunday
//     startDate = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate()));

//     console.log(`Generating weekly reports for ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
//   }

//   const projects = await Project.find({ status: 'active' });

//   for (const project of projects) {
//     // Find DSRs in the date range
//     const dsrs = await DSR.find({
//       project_id: project._id,
//       dsr_date: { $gte: startDate, $lte: endDate }
//     }).populate('employee_id', 'name designation');

//     if (dsrs.length === 0) {
//       console.log(`No DSRs for ${type} report - Project ${project.name}`);
//       continue;
//     }

//     // Build prompt based on type
//     let prompt = type === 'daily' 
//       ? `Generate a professional DAILY project status report in Markdown format.\n`
//       : `Generate a professional WEEKLY project status report in Markdown format (cover overall progress for the week).\n`;

//     prompt += `Project: ${project.name} (Code: ${project.code})\n`;
//     prompt += type === 'daily' 
//       ? `Date: ${reportDate.toISOString().split('T')[0]}\n\n`
//       : `Week: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}\n\n`;

//     prompt += `Employee Contributions:\n`;
//     dsrs.forEach(dsr => {
//       const emp = dsr.employee_id;
//       const dsrDateStr = dsr.dsr_date.toISOString().split('T')[0];
//       prompt += `\n- ${dsrDateStr} | Employee: ${emp?.name || 'Unknown'} (${emp?.designation || 'N/A'})\n`;
//       prompt += `  Tasks Completed: ${dsr.tasks_today.length ? dsr.tasks_today.join('; ') : 'None'}\n`;
//       prompt += `  Planned Next: ${dsr.tasks_tomorrow.length ? dsr.tasks_tomorrow.join('; ') : 'None'}\n`;
//       prompt += `  Blockers: ${dsr.blockers.length ? dsr.blockers.join('; ') : 'None'}\n`;
//       prompt += `  Notes: ${dsr.notes || 'None'}\n`;
//     });

//     prompt += `\nProvide a clear summary with sections: Overall Progress, Key Achievements, Upcoming Plans, Major Blockers, Recommendations.`;

//     try {
//       const result = await model.generateContent(prompt);
//       const content = result.response.text();

//       await Report.findOneAndUpdate(
//         { project: project._id, type, reportDate },
//         { content, generatedAt: new Date() },
//         { upsert: true, new: true }
//       );

//       console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated for ${project.name}`);
//     } catch (error) {
//       console.error(`Error generating ${type} report for ${project.name}:`, error.message);
//     }
//   }

//   console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} report generation complete.`);
// }

// // Daily at 8:50 PM IST
// cron.schedule('1 14 * * *', () => generateReports('daily'), { 
//   timezone: 'Asia/Kolkata' 
// }); 

// // Weekly every Sunday at 8:50 PM IST
// cron.schedule('50 20 * * 0', () => generateReports('weekly'), { 
//   timezone: 'Asia/Kolkata' 
// }); 

// console.log('Daily report job scheduled for 02:01 PM IST'); 
// console.log('Weekly report job scheduled for every Sunday 8:50 PM IST');