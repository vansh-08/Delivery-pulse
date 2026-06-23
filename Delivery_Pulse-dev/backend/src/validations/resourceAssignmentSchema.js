import Joi from 'joi';

// ResourceAssignment (if needed for future routes; currently no direct CRUD)
export const resourceAssignmentSchema = Joi.object({
  employee: Joi.string().hex().length(24).required(),
  project: Joi.string().hex().length(24).required(),
  projectManager: Joi.string().optional(),
  deliveryManager: Joi.string().optional(),
  billableStatus: Joi.string().optional(),
  resourceStatus: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});