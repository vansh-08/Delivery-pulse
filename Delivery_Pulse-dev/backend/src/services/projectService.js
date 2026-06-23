import ResourceAssignment from '../models/ResourceAssignment.js';
import Project from '../models/Project.js';

export const getProjectsByEmployee = async (employeeId) => {
  const assignments = await ResourceAssignment.find({ 
    employee: employeeId 
  }).populate('project');
  
  return assignments
    .map(a => a.project)
    .filter(Boolean); // filter out any null refs
};

export const getAllProjects = async () => {
  return await Project.find({ status: 'active' }).sort({ name: 1 });
};

export const createProject = async (projectData) => {
  return await Project.create(projectData);
};