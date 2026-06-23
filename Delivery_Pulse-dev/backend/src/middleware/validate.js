import Joi from 'joi';

export const validate = (schema, source = 'body') => (req, res, next) => {
  const data = req[source];
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      details: error.details.map(d => d.message) 
    });
  }
  next();
};