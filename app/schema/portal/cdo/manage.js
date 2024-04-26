const Joi = require('joi')

const manageCdosGetschema = Joi.object({
  tab: Joi.string().valid('live', 'expired', 'due', 'interim').default('live')
})

module.exports = {
  manageCdosGetschema
}
