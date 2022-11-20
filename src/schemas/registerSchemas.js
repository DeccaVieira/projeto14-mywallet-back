import joi from 'joi';
const registerSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required().min(3).max(100),
    type: joi.string().required().valid("outflow", "deposit"),
  });

export default registerSchema;