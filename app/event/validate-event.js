const schema = require('./event-schema')

const validateEvent = (event) => {
  const validate = schema.validate(event)
  if (validate.error) {
    console.error('Invalid event', validate.error)
    return false
  }
  return true
}

module.exports = {
  validateEvent
}
