import Joi from 'joi';

// Params/Queries (e.g., for GET /:id)
export const idSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const projectIdSchema = Joi.object({
  projectId: Joi.string().hex().length(24).required(),
});