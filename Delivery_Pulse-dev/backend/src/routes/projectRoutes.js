import express from 'express';
import { validate } from '../middleware/validate.js';
import { projectSchema } from '../validations/projectSchema.js';
import * as projectController from '../controllers/projectController.js';

const router = express.Router();

router.get('/my-projects', projectController.getMyProjects);
router.get('/', projectController.getAllProjects);
router.post('/', validate(projectSchema), projectController.createProject);

export default router;
