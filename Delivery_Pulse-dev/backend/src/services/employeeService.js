import Employee from '../models/Employee.js';

export const getAllEmployees = async () => {
  return await Employee.find({ isActive: true }).sort({ name: 1 });
};

export const createEmployee = async (employeeData) => {
  return await Employee.create(employeeData);
};