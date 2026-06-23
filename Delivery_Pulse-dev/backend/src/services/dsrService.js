import DSR from '../models/DSR.js';
import Project from '../models/Project.js';
import Employee from '../models/Employee.js';
import AppError from '../utils/AppError.js';

export const createDSR = async (dsrData) => {
  const {
    project_id,
    employee_id, // Now expected as actual Employee ObjectId (string)
    dsr_date,
    tasks_today = [],
    tasks_tomorrow = [],
    blockers = [],
    notes = ''
  } = dsrData;

  if (!project_id || !employee_id || !dsr_date) {
    throw new AppError('Project ID, Employee ID, and Date are required', 400);
  }

  // Validate project exists
  const project = await Project.findById(project_id);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Validate employee exists
  const employee = await Employee.findById(employee_id);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  const dsr = new DSR({
    project_id,
    employee_id,
    dsr_date: new Date(dsr_date),
    tasks_today,
    tasks_tomorrow,
    blockers,
    notes
  });

  await dsr.save();
  await dsr.populate('project_id', 'name code');
  await dsr.populate('employee_id', 'name email');

  return dsr;
};

export const getAllDSRs = async () => {
  return await DSR.find()
    .populate('project_id', 'name code')
    .populate('employee_id', 'name email')
    .sort({ dsr_date: -1 });
};

export const getDSRById = async (id) => {
  const dsr = await DSR.findById(id)
    .populate('project_id', 'name code description')
    .populate('employee_id', 'name email designation');

  if (!dsr) {
    throw new AppError('DSR not found', 404);
  }
  return dsr;
};

export const getMyDSRsS = async(employeeId) => {
  return await DSR.find({ employeeId })
  .populate('project_id', 'name code')
  .sort({ dsr_date: -1 });
}

export const getDSRsByEmployee = async (employeeId) => {
  return await DSR.find({ employee_id: employeeId })
    .populate('project_id', 'name code')
    .sort({ dsr_date: -1 });
};

export const getDSRsByProject = async (projectId) => {
  return await DSR.find({ project_id: projectId })
    .populate('employee_id', 'name email')
    .sort({ dsr_date: -1 });
};

export const updateDSR = async (id, updates) => {
  // Validate project_id if being updated
  if (updates.project_id) {
    const project = await Project.findById(updates.project_id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
  }

  // Validate employee_id if being updated
  if (updates.employee_id) {
    const employee = await Employee.findById(updates.employee_id);
    if (!employee) {
      throw new AppError('Employee not found', 404);
    }
  }

  const dsr = await DSR.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  })
    .populate('project_id', 'name code')
    .populate('employee_id', 'name email');

  if (!dsr) {
    throw new AppError('DSR not found', 404);
  }

  return dsr;
};

export const deleteDSR = async (id) => {
  const dsr = await DSR.findByIdAndDelete(id);
  if (!dsr) {
    throw new AppError('DSR not found', 404);
  }
};