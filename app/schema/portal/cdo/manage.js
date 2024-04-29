const Joi = require('joi')

const manageCdosGetschema = Joi.object({
  tab: Joi.string().valid('live', 'expired', 'due', 'interim').default('live'),
  sortKey: Joi.string().valid('indexNumber', 'cdoExpiry', 'owner', 'policeForce', 'interimExempt'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
})

module.exports = {
  manageCdosGetschema
}
