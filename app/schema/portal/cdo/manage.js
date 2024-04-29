const Joi = require('joi')

const manageCdosGetschema = Joi.object({
  tab: Joi.string().valid('live', 'expired', 'due', 'interim').default('live')
})

const manageCdosQueryschema = Joi.object({
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC'),
  sortKey: Joi.string().valid('indexNumber', 'cdoExpiry', 'owner', 'policeForce', 'interimExempt')
})

module.exports = {
  manageCdosGetschema,
  manageCdosQueryschema
}
