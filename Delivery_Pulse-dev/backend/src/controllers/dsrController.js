import * as dsrService from '../services/dsrService.js';
import DSR from '../models/DSR.js';

export const createDSR = async (req, res) => {
  try {
    const dsr = await dsrService.createDSR(req.body);

    res.status(201).json({
      success: true,
      message: 'DSR created successfully',
      data: dsr
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error creating DSR';

    if (error.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format';
    }
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors).map(err => err.message).join(', ');
    }

    console.error('Error creating DSR:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const getAllDSRs = async (req, res) => {
  try {
    const dsrs = await dsrService.getAllDSRs();

    res.status(200).json({
      success: true,
      count: dsrs.length,
      data: dsrs
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error fetching DSRs';

    console.error('Error fetching DSRs:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const getDSRById = async (req, res) => {
  try {
    const dsr = await dsrService.getDSRById(req.params.id);

    res.status(200).json({
      success: true,
      data: dsr
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error fetching DSR';

    if (error.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid DSR ID';
    }

    console.error('Error fetching DSR:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

// Get DSRs by current logged-in employee
export const getMyDSRs = async (req, res) => {
  try {
    const employee_id = req.session.user.employee_id;

    const dsrs = await DSR.find({ employee_id })
      .populate('project_id', 'name code')
      .sort({ dsr_date: -1 });

    // const dsrs = await dsrService.getMyDSRsS({ employee_id })

    res.status(200).json({
      success: true,
      count: dsrs.length,
      data: dsrs
    });

  } catch (error) {
    console.error('Error fetching DSRs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching DSRs',
      error: error.message
    });
  }
};


export const getDSRsByEmployee = async (req, res) => {
  try {
    const employee_id = req.session.user.employee_id;
    const dsrs = await dsrService.getDSRsByEmployee(employee_id);

    res.status(200).json({
      success: true,
      count: dsrs.length,
      data: dsrs
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error fetching employee DSRs';

    console.error('Error fetching employee DSRs:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const getDSRsByProject = async (req, res) => {
  try {
    const dsrs = await dsrService.getDSRsByProject(req.params.projectId);

    res.status(200).json({
      success: true,
      count: dsrs.length,
      data: dsrs
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error fetching project DSRs';

    console.error('Error fetching project DSRs:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const updateDSR = async (req, res) => {
  try {
    const dsr = await dsrService.updateDSR(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'DSR updated successfully',
      data: dsr
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error updating DSR';

    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors).map(err => err.message).join(', ');
    }

    console.error('Error updating DSR:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const deleteDSR = async (req, res) => {
  try {
    await dsrService.deleteDSR(req.params.id);

    res.status(200).json({
      success: true,
      message: 'DSR deleted successfully'
    });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Error deleting DSR';

    console.error('Error deleting DSR:', error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};