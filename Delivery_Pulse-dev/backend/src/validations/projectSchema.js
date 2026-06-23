import Joi from 'joi';

export const projectSchema = Joi.object({
  projectId: Joi.string().uppercase().trim().required(),
  name: Joi.string().trim().required(),
  accountName: Joi.string().optional(),
  vertical: Joi.string().optional(),
  domain: Joi.string().optional(),
});