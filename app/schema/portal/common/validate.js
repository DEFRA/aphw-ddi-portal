const validatePayloadBuilder = (schema) => (payload) => {
  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = { validatePayloadBuilder }
