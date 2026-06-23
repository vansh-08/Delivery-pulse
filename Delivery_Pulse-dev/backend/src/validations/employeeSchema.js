import Joi from 'joi';

export const employeeSchema = Joi.object({
  employeeCode: Joi.string().trim().optional(),
  name: Joi.string().trim().required(),
  designation: Joi.string().optional(),
  dateOfJoining: Joi.date().optional(),
  levelId: Joi.string().optional(),
  email: Joi.string().email().lowercase().trim().required(),
  location: Joi.string().optional(),
  contactNumber: Joi.string().optional(),
  department: Joi.string().optional(),
  isActive: Joi.boolean().default(true),
  totalExperience: Joi.string().optional(),
  txExperience: Joi.string().optional(),
  visaStatus: Joi.string().optional(),
  originalDu: Joi.string().optional(),
  assignedDu: Joi.string().optional(),
  skills: Joi.array().items(Joi.string().trim()).optional(),
});