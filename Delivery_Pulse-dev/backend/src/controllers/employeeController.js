import * as employeeService from '../services/employeeService.js';

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error fetching employees';

    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors).map(err => err.message).join(', ');
    }

    console.error('Error fetching employees:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error creating employee';

    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors).map(err => err.message).join(', ');
    }

    console.error('Error creating employee:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};