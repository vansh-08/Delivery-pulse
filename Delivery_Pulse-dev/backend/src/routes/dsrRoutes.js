import express from 'express';
import { validate } from '../middleware/validate.js';
import { dsrSchema, dsrUpdateSchema } from '../validations/dsrSchema.js';
import { idSchema, projectIdSchema } from '../validations/idSchema.js';
import * as dsrController from '../controllers/dsrController.js';

const router = express.Router();

// DSR routes
router.post('/', validate(dsrSchema), dsrController.createDSR);
router.get('/', dsrController.getAllDSRs);
router.get('/my', dsrController.getMyDSRs);
router.get('/employee', dsrController.getDSRsByEmployee);
router.get('/project/:projectId', validate(projectIdSchema, 'params'), dsrController.getDSRsByProject);
router.get('/:id', validate(idSchema, 'params'), dsrController.getDSRById);
router.put('/:id', validate(idSchema, 'params'), validate(dsrUpdateSchema), dsrController.updateDSR);
router.delete('/:id', validate(idSchema, 'params'), dsrController.deleteDSR);

export default router;