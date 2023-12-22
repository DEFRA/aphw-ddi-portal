const { put } = require('./base')

const exemptionEndpoint = 'exemption'

const updateExemption = async (exemption) => {
  const res = await put(exemptionEndpoint, exemption)

  return res
}

module.exports = {
  updateExemption
}
