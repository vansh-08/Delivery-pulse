import * as projectService from '../services/projectService.js';
import ResourceAssignment from '../models/ResourceAssignment.js';
import Employee from '../models/Employee.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error fetching projects';

    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors).map(err => err.message).join(', ');
    }

    console.error('Error fetching projects:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error creating project';

    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors).map(err => err.message).join(', ');
    }

    console.error('Error creating project:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const employeeId = req.session.user.employee_id;
    // console.log(`Employee: ${employee}`);
    if (!employeeId) {
      return res.status(404).json({ message: 'Employee profile not found.' });
    }

    const assignments = await ResourceAssignment.find({ 
      employee: employeeId
    }).populate('project');

    const projects = assignments
      .map(a => a.project)
      .filter(Boolean);
    // console.log(`Projects: ${projects}`);

    res.json(projects);
  } catch (err) {
    console.error('getMyProjects error:', err);
    res.status(500).json({ message: err.message });
  }
};