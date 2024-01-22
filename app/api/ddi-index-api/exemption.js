const { put } = require('./base')

const exemptionEndpoint = 'exemption'

const updateExemption = async (exemption, user) => {
  const res = await put(exemptionEndpoint, exemption, user)

  return res
}

module.exports = {
  updateExemption
}
