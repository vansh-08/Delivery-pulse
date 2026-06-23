import Joi from 'joi';

export const dsrSchema = Joi.object({
  project_id: Joi.string().hex().length(24).required(), // ObjectId
  employee_id: Joi.string().hex().length(24).required(),
  dsr_date: Joi.date().required(),
  tasks_today: Joi.array().items(Joi.string().trim()).required(),
  tasks_tomorrow: Joi.array().items(Joi.string().trim()).required(),
  blockers: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().optional(),
});

export const dsrUpdateSchema = dsrSchema.optional().keys({ // Partial for PUT
  // project_id: Joi.forbidden(), // e.g., don't allow changing IDs
  employee_id: Joi.forbidden(),
});