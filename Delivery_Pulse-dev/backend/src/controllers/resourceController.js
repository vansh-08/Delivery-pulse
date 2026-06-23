import xlsx from 'xlsx';
import Employee from '../models/Employee.js';
import Project from '../models/Project.js';
import ResourceAssignment from '../models/ResourceAssignment.js';

export const uploadResources = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No Excel file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Normalize keys (trim spaces) for each row
    const normalizedRows = rows.map(row => {
      const newRow = {};
      for (const key in row) {
        const trimmedKey = key.trim();
        newRow[trimmedKey] = row[key];
      }
      return newRow;
    });

    let processed = 0;

    for (const row of normalizedRows) {
      // Skip empty/invalid rows
      if (!row || Object.keys(row).length === 0) {
        console.log('Skipping empty row');
        continue;
      }

      const employeeData = {
        employeeCode: String(row['Employee Code'] || '').trim(),
        name: String(row['Name of Employee'] || '').trim(),
        designation: row['Designation'],
        dateOfJoining: row['Date of joining'] ? new Date(row['Date of joining']) : null,
        levelId: row['Level Id'],
        email: String(row['Employee Email ID'] || '').trim().toLowerCase(),
        location: row['Location'],
        contactNumber: String(row['Contact Number'] || ''),
        totalExperience: row['Total Experience'],
        txExperience: row['TX Experience'],
        visaStatus: row['Visa Status'],
        originalDu: row['Original Du'],
        assignedDu: row['Assigned Du'],
        skills: row['Skills'] 
          ? String(row['Skills']).split(',').map(s => s.trim()).filter(Boolean)
          : [],
      };

      // Skip if no email
      if (!employeeData.email) {
        console.warn(`Skipping row with missing email: ${JSON.stringify(row)}`);
        continue;
      }

      const employee = await Employee.findOneAndUpdate(
        { email: employeeData.email },
        employeeData,
        { upsert: true, new: true, runValidators: true }
      );

      const projectData = {
        projectId: String(row['Project ID'] || '').trim().toUpperCase(),
        name: row['Project Name'],
        accountName: row['Account Name'],
        vertical: row['Vertical'],
        domain: row['Domain'],
      };

      const project = await Project.findOneAndUpdate(
        { projectId: projectData.projectId },
        projectData,
        { upsert: true, new: true }
      );

      const assignmentData = {
        employee: employee._id,
        project: project._id,
        projectManager: row['Project Manager'],
        deliveryManager: row['Delivery Manager'],
        billableStatus: row['Billable/NonBillable'],
        resourceStatus: row['Resource Status'],
        startDate: row['Start Date'] ? new Date(row['Start Date']) : null,
        endDate: row['End Date'] ? new Date(row['End Date']) : null,
      };

      await ResourceAssignment.findOneAndUpdate(
        { employee: employee._id, project: project._id },
        assignmentData,
        { upsert: true }
      );

      processed++;
    }

    res.status(200).json({ 
      message: `✅ Successfully processed ${processed} rows`,
      totalRows: normalizedRows.length 
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: '❌ Upload failed', 
      error: error.message 
    });
  }
};