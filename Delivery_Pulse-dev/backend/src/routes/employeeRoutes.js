import express from 'express';
import { validate } from '../middleware/validate.js';
import { employeeSchema } from '../validations/employeeSchema.js';
import * as employeeController from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', employeeController.getAllEmployees);
router.post('/', validate(employeeSchema), employeeController.createEmployee);

export default router;
