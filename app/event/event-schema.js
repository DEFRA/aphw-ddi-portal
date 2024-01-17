const Joi = require('joi')

module.exports = Joi.object({
  type: Joi.string().required(),
  source: Joi.string().required(),
  id: Joi.string().required(),
  subject: Joi.string().optional(),
  data: Joi.object(
    {
      message: Joi.string().required()
    }
  ).optional()
}).required()
